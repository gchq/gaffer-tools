package uk.gov.gchq.gaffer.quickstart.operation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang3.exception.CloneFailedException;
import uk.gov.gchq.gaffer.commonutil.Required;
import uk.gov.gchq.gaffer.operation.Operation;
import uk.gov.gchq.gaffer.operation.Validatable;

import java.util.Map;

public class CalculateSplitPointsQuickstart implements Operation, Validatable {

    @Required
    private String dataPath;
    @Required
    private String elementGeneratorConfig;

    private String outputPath;
    private String failurePath;

    private String sampleRatioForSplits = "0.001";
    private int numSplits = 0;
    private String splitsFilePath;

    private boolean validate = true;

    public void setDataPath(final String inputPath) {
        this.dataPath = inputPath;
    }

    public void setOutputPath(String outputPath) {
        this.outputPath = outputPath;
    }

    public String getFailurePath() {
        return failurePath;
    }

    public void setFailurePath(String failurePath) {
        this.failurePath = failurePath;
    }

    public String getOutputPath() {
        return outputPath;
    }

    public void setElementGeneratorConfig(final String elementGeneratorConfigPath) {
        this.elementGeneratorConfig = elementGeneratorConfigPath;
    }

    public int getNumSplits() {
        return numSplits;
    }

    public void setNumSplits(int numSplits) {
        this.numSplits = numSplits;
    }

    public String getDataPath(){
        return dataPath;
    }

    public String getElementGeneratorConfig(){
        return this.elementGeneratorConfig;
    }

    @Override
    public Operation shallowClone() throws CloneFailedException {
        return new Builder()
                .dataPath(dataPath)
                .outputPath(outputPath)
                .failurePath(failurePath)
                .sampleRatioForSplits(sampleRatioForSplits)
                .splitsFilePath(splitsFilePath)
                .elementGeneratorConfig(elementGeneratorConfig)
                .validate(validate)
                .numPartitions(numSplits)
                .build();
    }

    @JsonIgnore
    @Override
    public Map<String, String> getOptions() {
        return null;
    }

    @JsonIgnore
    @Override
    public void setOptions(Map<String, String> options) {

    }

    @Override
    public boolean isSkipInvalidElements() {
        return false;
    }

    @Override
    public void setSkipInvalidElements(boolean skipInvalidElements) {

    }

    @Override
    public boolean isValidate() {
        return validate;
    }

    @Override
    public void setValidate(boolean validate) {
        this.validate = validate;
    }

    public String getSampleRatioForSplits() {
        return sampleRatioForSplits;
    }

    public void setSampleRatioForSplits(String sampleRatioForSplits) {
        this.sampleRatioForSplits = sampleRatioForSplits;
    }

    public String getSplitsFilePath() {
        return splitsFilePath;
    }

    public void setSplitsFilePath(String splitsFilePath) {
        this.splitsFilePath = splitsFilePath;
    }

    public static class Builder extends BaseBuilder<CalculateSplitPointsQuickstart, Builder> implements Validatable.Builder<CalculateSplitPointsQuickstart, Builder> {
        public Builder() {
            super(new CalculateSplitPointsQuickstart());
        }

        public Builder dataPath(final String inputPath){
            _getOp().setDataPath(inputPath);
            return _self();
        }

        public Builder outputPath(final String outputPath){
            _getOp().setOutputPath(outputPath);
            return _self();
        }

        public Builder failurePath(final String failurePath){
            _getOp().setFailurePath(failurePath);
            return _self();
        }

        public Builder validate(final boolean validate){
            _getOp().setValidate(validate);
            return _self();
        }

        public Builder numPartitions(final int numPartitions){
            _getOp().setNumSplits(numPartitions);
            return _self();
        }

        public Builder elementGeneratorConfig(final String elementGeneratorConfigPath){
            _getOp().setElementGeneratorConfig(elementGeneratorConfigPath);
            return _self();
        }

        public Builder sampleRatioForSplits(final String sampleRatioForSplits){
            _getOp().setSampleRatioForSplits(sampleRatioForSplits);
            return _self();
        }

        public Builder splitsFilePath(final String splitsFilePath){
            _getOp().setSplitsFilePath(splitsFilePath);
            return _self();
        }
    }
}
