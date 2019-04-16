#
# Copyright 2016-2019 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

"""

"""

import getpass
import json
import logging
import os
from py4j.java_gateway import JavaGateway, CallbackServerParameters, GatewayParameters
import requests
import subprocess as sp
import signal
import time

from gafferpy_core import gaffer_utils as u

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
logger.addHandler(ch)


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(
                Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class GafferPythonSession(metaclass=Singleton):

    """
    Creates a Python Session and instanticates User Object plus others
    """

    # general things
    _java_gaffer_session = None
    _java_gateway = None
    _java_server_process = None
    _java_gaffer_session_class = "uk.gov.gchq.gaffer.python.Application"

    # python things
    _jar = None
    _lib_jars = None
    _this_session_pid = None

    # Internal stuff
    __user = None

    def create_session(self, jar=None, lib_jars=None, kill_existing_sessions=False):
        """
        A public method for creating a python gaffer session.
        """
        global gaffer_session
        if 'gaffer_session' in globals():
            pid = globals().get('gaffer_session').get_session_pid()
            logger.info("already a gaffer session at pid " + str(pid))
        else:
            logger.info("no gaffer session available, creating one")
            self._jar = jar
            self._lib_jars = lib_jars
            self._check_running_processes(kill_existing_sessions)
            self._start_session()
            gaffer_session = self
        return gaffer_session

    def _start_session(self):
        """
        A private method used for instantiating a java Gaffer session
        """

        if self._lib_jars == None:
            libs = ""
        else:
            libs = self._lib_jars.replace(",", ":")
            libs = ":" + libs
        start_command = "java -cp " + self._jar + \
            libs + " " + self._java_gaffer_session_class
        self._java_server_process = self._run_shell_command(start_command)
        self._this_session_pid = self._java_server_process.pid
        logger.info("starting gaffer session : {} \n".format(start_command))
        logger.info("starting python gateway\n")
        logger.info("waiting for gateway...\n")
        gateway = JavaGateway()
        java_session = JavaGateway().entry_point
        if java_session.serverRunning():
            self._java_gateway = gateway
            self._java_gaffer_session = java_session
            logger.info("Server ready, pid = " + str(self._this_session_pid))
        else:
            msg = "server failed to start"
            logger.error(msg)
            raise RuntimeError(msg)

    def connect_to_session(self, address="127.0.0.1", port=25333):
        """
        Public method for just connecting to a running gaffer session
        """
        print("""
             _<^```\                                                                          
           __>'- ~--^^~            .                                                          
           _>  / '     \             o                           .                            
          _> ,/ .  @_^`^)                      O                         O                       
         -   |.   /_,__ )     o                                                               
         _> | /   '  (.       ________        _____  __O__       o      _______             .        
          >_(/ _    (_ \     /  _____/_____ _/ ____\/ ____\___________  \__  _ \__o_.__.   
            /.'    (  `.\   /   \  ___\__  \\\\   __\\\\   __\/ __ \_  ___\   |  __/\_  |  |  
              (   (         \    \_\  \/ __ \|  |   |  | \  ___/|  |      |  |    \__  |      
               (   (         \________/(____/|__|   |__|  \_____|__|      |__|    / ___|  
                `( `l./^^>               __                                       \/      
                  `l.  /                /  \                                                      
                    l |                 \__/   _                                              
                     l(                       (_)                                           
        """)

        global gaffer_session
        if 'gaffer_session' in globals():
            return globals().get('gaffer_session')

        if(os.environ.get('SSL-Enabled') == "True"):
            s = requests.Session()
            try:
                s.verify = os.environ.get('Cert-Path')
                pass
            except ValueError as identifier:
                logger.error(identifier)
                print("Ignoring certification verification")
                pass
            except OSError as identifier:
                logger.error(identifier)
                print("Ignoring certification verification")
                pass
            finally:
                s.verify = False

            username = input("Please enter your username: ")
            password = getpass.getpass(
                prompt='Please enter your password: ', stream=None)
            s.post(url=os.environ.get('Auth-URL'),
                   data={'username': username, 'password': password})

            sessionResponse = s.get(os.environ.get('Session-Create-URL'))

            if(sessionResponse.status_code == 200):
                response = json.loads(sessionResponse.text)
                addres = response['address'].split('/')
                address = addres[1]
                port = response['portNumber']
                token = response['token']
                self.__user = u.User(user_id=username)
            else:
                logger.error(sessionResponse.text)
                raise sessionResponse.text

        try:
            session = None
            if(os.environ.get('SSL-Enabled') == "True"):
                session = JavaGateway(gateway_parameters=GatewayParameters(address=address,
                                                                           port=port,
                                                                           auth_token=token
                                                                           ))
            else:
                session = JavaGateway(
                    gateway_parameters=GatewayParameters(address=address, port=port))
            self._java_gateway = session
            self._java_gaffer_session = session.entry_point
            logger.info("Connected to Gaffer Session")
            gaffer_session = self
        except:
            logger.error("Issue connecting to Gaffer Session")

    def stop_session(self):
        if(self._java_gateway == None):
            logger.info("no session to stop")
        else:
            logger.info("shutting down python gateway\n")
            self._java_gateway.shutdown()
            logger.info("stopping gaffer session")
            self._java_server_process.send_signal(signal.SIGTERM)
            self._java_gateway = None
            globals().pop('gaffer_session', None)
            logger.info("session stopped")

    def get_session_pid(self):
        return self._this_session_pid

    def _check_running_processes(self, kill):
        """
        Checks to see if there are any java gaffer sessions already running.
        If there are:
            if 'kill' set to true, the existing processes are terminated and a new one is started
            if 'kill' set to false, this method returns the list of pid of the existing sessions and throws an exception
        """
        fail = True
        if self._jar == None:
            msg = "Need a jar"
            logger.error(msg)
            raise ValueError(msg)
        grep_command = "ps -ef | grep " + self._jar
        pids = []
        process_check = self._run_shell_command(grep_command)
        for line in process_check.stdout.readlines():
            if ("java -cp" in str(line)) & (self._jar in str(line)) & (self._java_gaffer_session_class in str(line)):
                t = str(line).split()
                pid = t[2]
                pids.append(pid)
                logger.debug("found existing session with pid " +
                             pid + ", will terminate it")
        if len(pids) == 0:
            fail = False
        elif kill:
            for pid in pids:
                self._kill_process(pid)
            fail = False
        if fail:
            msg = "found gaffer session already running that I didn't start on pids " + \
                str(pids)
            logger.error(msg)
            raise ValueError(msg)

    def _run_shell_command(self, command):
        return sp.Popen(command, shell=True,
                        stderr=sp.PIPE,
                        stdout=sp.PIPE)

    def _kill_process(self, pid):
        kill_command = "kill -9 " + pid
        res = self._run_shell_command(kill_command)
        logger.info("killed process " + pid)

    def getUser(self):
        return self.__user
