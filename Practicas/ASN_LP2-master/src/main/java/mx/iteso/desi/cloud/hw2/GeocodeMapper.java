package mx.iteso.desi.cloud.hw2;

import mx.iteso.desi.cloud.*;

import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.*;

import java.io.IOException;
import java.util.StringTokenizer;

public class GeocodeMapper extends Mapper<LongWritable, Text, Text, GeocodeWritable> {
    //private final static IntWritable one = new IntWritable(1);
    private Text word = new Text();
    private final static GeocodeWritable one = new GeocodeWritable();




  /* TODO: Your mapper code here */
  public void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
      Triple triple;

      StringTokenizer itr = new StringTokenizer(value.toString(),"\n");
      while (itr.hasMoreTokens()){
          String token = itr.nextToken();
          if(token.charAt(0) == '#')
              continue;
          triple = ParseTriple.parseTriple(token);

          if (triple.get(1).equals("http://www.georss.org/georss/point")){
              Double [] lat_lon = ParserCoordinates.parseCoordinates(triple.get(2));
              one.set(new Text("LOCATION"), new DoubleWritable(lat_lon[0].doubleValue()), new DoubleWritable(lat_lon[1].doubleValue()));
              word.set(triple.get(0));
              context.write(word, one);
          }
          else if (triple.get(1).equals("http://xmlns.com/foaf/0.1/depiction")){

              one.set(new Text(triple.get(2)), new DoubleWritable(), new DoubleWritable());
              word.set(triple.get(0));
              context.write(word, one);
          }


      }


  }
  
}
