package mx.iteso.desi.cloud.hw2;

import mx.iteso.desi.cloud.Geocode;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.io.*;

import mx.iteso.desi.cloud.GeocodeWritable;

import java.io.IOException;

public class GeocodeReducer extends Reducer<Text, GeocodeWritable, Text, Text> {

  /* TODO: Your reducer code here */

    private String name;
    private double lat, lon;
    private Geocode geocode;
    private Geocode GDL = new Geocode("Guadalajara", 20.6597, 103.3496);
    private Geocode MTY = new Geocode("Monterrey", 25.6866, 100.3161);
    private Geocode PHI = new Geocode("Philadelphia", 39.88, -75.25);
    private Geocode HST = new Geocode("Houston", 29.97, -95.35);
    private Geocode STL = new Geocode("Seattle", 47.45, -122.30);



    public void reduce(Text key, Iterable<GeocodeWritable> values, Context context) throws IOException, InterruptedException {

        for (GeocodeWritable g : values){
                if(g.getName().toString().equals("LOCATION")){
                    lat = g.getLatitude();
                    lon = g.getLongitude();
                }
                else {
                    name = g.getName().toString();

                }
        }
        geocode = new Geocode(name, lat, lon);
        if (geocode.getHaversineDistance(20.6597, 103.3496) <= 5000.00){
            context.write(key, new Text(geocode.toString()));
        }  else if (geocode.getHaversineDistance(25.6866, 100.3161) <= 5000.00){
            context.write(key, new Text(geocode.toString()));
        }  else if (geocode.getHaversineDistance(39.88, -75.25) <= 5000.00){
            context.write(key, new Text(geocode.toString()));
        }  else if (geocode.getHaversineDistance(29.97, -95.35) <= 5000.00){
            context.write(key, new Text(geocode.toString()));
        }  else if (geocode.getHaversineDistance(47.45, -122.30) <= 5000.00){
            context.write(key, new Text(geocode.toString()));
        }
    }
}
