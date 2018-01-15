import uk.gov.gchq.gaffer.graph._
import uk.gov.gchq.gaffer.user._
import uk.gov.gchq.gaffer.store.schema._
import uk.gov.gchq.gaffer.accumulostore._
import uk.gov.gchq.gaffer.data.element._
import uk.gov.gchq.gaffer.data.elementdefinition.view._

import uk.gov.gchq.gaffer.operation.data._
import uk.gov.gchq.gaffer.operation.impl.get._

import uk.gov.gchq.gaffer.spark.operation.scalardd._
import uk.gov.gchq.gaffer.spark.operation.javardd._
import uk.gov.gchq.gaffer.spark.operation.dataframe._

import org.apache.accumulo.core.client.ZooKeeperInstance
import org.apache.accumulo.core.client.security.tokens.PasswordToken
import org.apache.accumulo.core.security.TablePermission

import scala.io.Source
import scala.collection.JavaConversions._


val storeProperties = AccumuloProperties.loadStoreProperties(System.getenv("GAFFER_USER") + ".store.properties")

val accumuloInstance = new ZooKeeperInstance(storeProperties.getInstance, storeProperties.getZookeepers)
val accumulo = accumuloInstance.getConnector("root", new PasswordToken(Source.fromFile("../etc/root.password").mkString.trim))

var graphId = System.getenv("GRAPH_ID")

if (graphId == null || graphId.isEmpty) {
	val tables = accumulo.tableOperations.list.filter(!_.startsWith("accumulo.")).filter(accumulo.securityOperations.hasTablePermission(storeProperties.getUser, _, TablePermission.READ))
	if (tables.size == 0) {
		println("There are no Accumulo tables that " + storeProperties.getUser + " can access!")
		System.exit(1)
	} else if (tables.size > 1) {
		println("This Accumulo instance contains multiple Gaffer graphs, please specify the graphId that you wish to connect to on the command line")
		System.exit(1)
	} else {
		graphId = tables.head
	}
} else if (!accumulo.tableOperations.exists(graphId)) {
	println("Accumulo table does not exist for graphId: " + graphId)
	System.exit(1)
}

val schemas = accumulo.tableOperations.getProperties(graphId).filter(prop => prop.getKey.startsWith("table.iterator.") && prop.getKey.endsWith(".Schema")).map(_.getValue)
if (schemas.toList.distinct.length == 0) {
	println("Unable to retrieve Gaffer Graph Schema from Accumulo Table!")
	System.exit(1)
} else if (schemas.toList.distinct.length > 1) {
	println("There are multiple different schemas stored on the Accumulo Table. Unable to continue!")
	System.exit(1)
}
val schema = Schema.fromJson(schemas.head.getBytes)

val graph = new Graph.Builder().config(new GraphConfig.Builder().graphId(graphId).build()).addSchemas(schema).storeProperties(storeProperties).build()

println(Source.fromURL("https://raw.githubusercontent.com/gchq/Gaffer/master/logos/asciiLogo.txt").mkString)
println("You are connected to a Gaffer graph backed by an Accumulo Store:")
println("\tAccumulo Instance: " + storeProperties.getInstance)
println("\tZooKeepers: " + storeProperties.getZookeepers)
println("\tGraphId: " + graphId)
println("\tUsername: " + storeProperties.getUser)
println("Connection to Gaffer available at 'graph'")
println("")
println("Example Query:")
println("val sample = graph.execute(new GetAllElements(), new User())")
println("sample.take(20).foreach(println)")
println("sample.close")
