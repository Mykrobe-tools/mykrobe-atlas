#!/bin/bash

# capture raw output from mykrobe binaries processing bam files
# takes a long time :)

BAM_SOURCE_DIR='/Users/simon/Dropbox/Make + Ship Limited/Work/MYK-14-034 Mykrobe/Client Documents/bams'
BIN_DIR='../../static/bin'

echo 'Processing 1/4'
eval "./$BIN_DIR/predictor-s-aureus/osx/Mykrobe.predictor.staph --install_dir '$BIN_DIR/predictor-s-aureus' --file '$BAM_SOURCE_DIR/staph/C00001084_R00000022.bam' --format JSON --progress > C00001084_R00000022.output.raw"

echo 'Processing 2/4'
eval "./$BIN_DIR/predictor-s-aureus/osx/Mykrobe.predictor.staph --install_dir '$BIN_DIR/predictor-s-aureus' --file '$BAM_SOURCE_DIR/staph/C00007086_R00000022.bam' --format JSON --progress > C00007086_R00000022.output.raw"

echo 'Processing 3/4'
eval "./$BIN_DIR/predictor-tb/osx/Mykrobe.predictor.tb --install_dir '$BIN_DIR/predictor-tb' --file '$BAM_SOURCE_DIR/tb/C00009037_R00000039.bam' --format JSON --progress > C00009037_R00000039.output.raw"

echo 'Processing 4/4'
eval "./$BIN_DIR/predictor-tb/osx/Mykrobe.predictor.tb --install_dir '$BIN_DIR/predictor-tb' --file '$BAM_SOURCE_DIR//tb/C00014841_R00000039.bam' --format JSON --progress > C00014841_R00000039.output.raw"

echo 'Done'
