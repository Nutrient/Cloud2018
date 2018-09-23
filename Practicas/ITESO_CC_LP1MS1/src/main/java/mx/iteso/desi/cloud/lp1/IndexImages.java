package mx.iteso.desi.cloud.lp1;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.amazonaws.services.dynamodbv2.document.Item;
import mx.iteso.desi.cloud.keyvalue.IKeyValueStorage;
import mx.iteso.desi.cloud.keyvalue.KeyValueStoreFactory;
import mx.iteso.desi.cloud.keyvalue.ParseTriples;
import mx.iteso.desi.cloud.keyvalue.PorterStemmer;
import mx.iteso.desi.cloud.keyvalue.Triple;

public class IndexImages {
  ParseTriples parser;
  IKeyValueStorage imageStore, titleStore;
    
  public IndexImages(IKeyValueStorage imageStore, IKeyValueStorage titleStore) {
	  this.imageStore = imageStore;
	  this.titleStore = titleStore;
  }
      
  public void run(String imageFileName, String titleFileName) throws IOException
  {
    // TODO: This method should load all images and titles 
    //       into the two key-value stores.
    parser = new ParseTriples(imageFileName);
    Triple t;
    if (Config.storeType == KeyValueStoreFactory.STORETYPE.BERKELEY){
        while ((t = parser.getNextTriple()) != null ){
          if (t.get(1).equals("http://xmlns.com/foaf/0.1/depiction") /*&& !imageStore.exists(t.get(0))*/ && t.get(0).startsWith("http://dbpedia.org/resource/" + Config.filter))
              imageStore.addToSet(t.get(0), t.get(2));
        }
        parser.close();
        parser = new ParseTriples(titleFileName);
        while ((t = parser.getNextTriple()) != null ){
          if (t.get(1).equals("http://www.w3.org/2000/01/rdf-schema#label") && t.get(2).startsWith(Config.filter) && imageStore.exists(t.get(0))) {
            String[] keys = t.get(2).split("\\s+");
            for (String key : keys) {
              String porterStemTerm = PorterStemmer.stem(key);
             // System.out.println(porterStemTerm);
              if (porterStemTerm.equals("Invalid term"))
                 porterStemTerm = key;
              if(!titleStore.exists(porterStemTerm)) {
                titleStore.addToSet(porterStemTerm, t.get(0));
              }
            }
          }
        }
    }
    else if (Config.storeType == KeyValueStoreFactory.STORETYPE.DYNAMODB){
        List<Item> dictionary = new ArrayList<Item>();
        int inx = 0;


        while ((t = parser.getNextTriple()) != null ){

            if (t.get(1).equals("http://xmlns.com/foaf/0.1/depiction") && t.get(0).toUpperCase().startsWith("http://dbpedia.org/resource/".toUpperCase() + Config.filter)) {
                //if(!imageStore.exists(t.get(0)))
                dictionary.add(new Item().withPrimaryKey("Keyword", t.get(0))
                        .withNumber("inx", inx++)
                        .withString("Value", t.get(2)));
                //System.out.println(t.get(0) + " " + t.get(1) + " "+ t.get(2));
                if (dictionary.size() == 25) {
                    imageStore.addToSet(dictionary);
                    dictionary.clear();
                }
            }
        }

        if (dictionary.size() > 0) {
            imageStore.addToSet(dictionary);
            dictionary.clear();
        }
        parser.close();
        inx = 0;
        parser = new ParseTriples(titleFileName);
        HashSet<String> itemList = new HashSet<String>();
        while ((t = parser.getNextTriple()) != null ){
            if (t.get(1).equals("http://www.w3.org/2000/01/rdf-schema#label") && t.get(2).toUpperCase().startsWith(Config.filter)){
                if (!itemList.contains(t.get(0)))
                   if(imageStore.exists(t.get(0)))
                        itemList.add(t.get(0));



                if (itemList.contains(t.get(0))){
                    String[] keys = t.get(2).split("\\s+");
                    for (String key : keys) {
                        String porterStemTerm = PorterStemmer.stem(key);
                        //System.out.println(porterStemTerm);
                        if (porterStemTerm.equals("Invalid term"))
                            porterStemTerm = key;
                        dictionary.add(new Item().withPrimaryKey("Keyword", porterStemTerm.toLowerCase())
                                .withNumber("inx", inx++)
                                .withString("Value", t.get(0)));
                        if (dictionary.size() == 25) {
                            titleStore.addToSet(dictionary);
                            dictionary.clear();
                        }
                    }
                }
            }
        }
        if (dictionary.size() > 0) {
            titleStore.addToSet(dictionary);
            dictionary.clear();
        }


    }
    parser.close();


  }
  
  public void close() {
	  //TODO: close the databases;
    imageStore.close();
    titleStore.close();

  }

  public static void main(String args[])
  {
    // TODO: Add your own name here
    System.out.println("*** Alumno: _____________________ (Exp: _________ )");
    try {

      IKeyValueStorage imageStore = KeyValueStoreFactory.getNewKeyValueStore(Config.storeType, 
    			"images");
      IKeyValueStorage titleStore = KeyValueStoreFactory.getNewKeyValueStore(Config.storeType, 
  			"terms");


      IndexImages indexer = new IndexImages(imageStore, titleStore);
      indexer.run(Config.imageFileName, Config.titleFileName);
      indexer.close();
      System.out.println("Indexing completed");
      
    } catch (Exception e) {
      e.printStackTrace();
      System.err.println("Failed to complete the indexing pass -- exiting");
    }
  }
}

