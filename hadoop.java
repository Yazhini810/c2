import org.apache.hadoop.io.*; 
import org.apache.hadoop.mapreduce.*; 
import org.apache.hadoop.fs.*; 
import org.apache.hadoop.conf.*;

public class WordCount {
  public static class Map extends Mapper<LongWritable, Text, Text, IntWritable> {
    public void map(LongWritable k, Text v, Context c) throws java.io.IOException, InterruptedException {
      for(String w:v.toString().split(" ")) c.write(new Text(w), new IntWritable(1));
    }
  }
  public static class Reduce extends Reducer<Text, IntWritable, Text, IntWritable> {
    public void reduce(Text k, Iterable<IntWritable> v, Context c) throws java.io.IOException, InterruptedException {
      int s=0; for(IntWritable i:v) s+=i.get(); c.write(k,new IntWritable(s));
    }
  }
  public static void main(String[] a) throws Exception {
    Job j=Job.getInstance(new Configuration(),"wc");
    j.setJarByClass(WordCount.class);
    j.setMapperClass(Map.class);
    j.setReducerClass(Reduce.class);
    j.setOutputKeyClass(Text.class);
    j.setOutputValueClass(IntWritable.class);
    FileInputFormat.addInputPath(j,new Path(a[0]));
    FileOutputFormat.setOutputPath(j,new Path(a[1]));
    j.waitForCompletion(true);
  }
}
# Install Java
sudo apt update
sudo apt install openjdk-8-jdk -y

# Download and extract Hadoop
cd /usr/local
sudo wget https://downloads.apache.org/hadoop/common/hadoop-3.3.6/hadoop-3.3.6.tar.gz
sudo tar -xvzf hadoop-3.3.6.tar.gz
sudo mv hadoop-3.3.6 hadoop

# Set environment variables
echo 'export HADOOP_HOME=/usr/local/hadoop' >> ~/.bashrc
echo 'export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin' >> ~/.bashrc
source ~/.bashrc

# Set Java path in Hadoop
echo 'export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64' >> $HADOOP_HOME/etc/hadoop/hadoop-env.sh

# Format HDFS
hdfs namenode -format

# Start Hadoop
start-dfs.sh
start-yarn.sh

# Check running services
jps

# Create input, upload and run example job
hdfs dfs -mkdir /input
echo "Hello Hadoop" > input.txt
hdfs dfs -put input.txt /input
hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.3.6.jar wordcount /input /output
hdfs dfs -cat /output/part-r-00000

