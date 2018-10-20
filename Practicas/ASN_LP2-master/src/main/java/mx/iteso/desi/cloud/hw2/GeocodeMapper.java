package mx.iteso.desi.cloud.hw2;

import mx.iteso.desi.cloud.GeocodeWritable;

import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.*;

import java.io.IOException;
import java.util.StringTokenizer;

public class GeocodeMapper extends Mapper<LongWritable, Text, Text, GeocodeWritable> {

  /* TODO: Your mapper code here */
  public void map(LongWritable key, Text value, Text value2, Context context) throws IOException, InterruptedException {
      StringTokenizer itr = new StringTokenizer(value.toString());
      while(itr.hasMoreTokens()) {
          System.out.println(itr.nextToken());
         // word.set(itr.nextToken());
          //context.write(word, one);
      }
  }
  
}
