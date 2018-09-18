package mx.iteso.desi.cloud.lp1;

import java.net.UnknownHostException;
import java.util.Scanner;
import java.util.Set;
import java.util.Iterator;
import java.util.HashSet;
import mx.iteso.desi.cloud.keyvalue.KeyValueStoreFactory;
import mx.iteso.desi.cloud.keyvalue.IKeyValueStorage;
import mx.iteso.desi.cloud.keyvalue.PorterStemmer;

public class QueryImages {
  IKeyValueStorage imageStore;
  IKeyValueStorage titleStore;
	
  public QueryImages(IKeyValueStorage imageStore, IKeyValueStorage titleStore) 
  {
	  this.imageStore = imageStore;
	  this.titleStore = titleStore;
  }
	
  public Set<String> query(String word)
  {
    // TODO: Return the set of URLs that match the given word,
    //       or an empty set if there are no matches
        Set<String> imagesSet = new HashSet<String>();
        Iterator<String> iter = titleStore.get(word).iterator();
        while (iter.hasNext()){
            Iterator<String> iter2 = imageStore.get(iter.next()).iterator();
            while (iter2.hasNext())
                imagesSet.add(iter2.next());

        }
        return imagesSet;
  }
        
  public void close()
  {
    // TODO: Close the databases
      imageStore.close();
      titleStore.close();
  }
	
  public static void main(String args[]) 
  {
    // TODO: Add your own name here
    System.out.println("*** Alumno: _____________________ (Exp: _________ )");
    
    // TODO: get KeyValueStores
    IKeyValueStorage imageStore = null;
    IKeyValueStorage titleStore  = null;
    try {
      imageStore = KeyValueStoreFactory.getNewKeyValueStore(Config.storeType,
              "images");
      titleStore = KeyValueStoreFactory.getNewKeyValueStore(Config.storeType,
              "terms");
    } catch (UnknownHostException e) {
      e.printStackTrace();
    }

    
    QueryImages myQuery = new QueryImages(imageStore, titleStore);
    Scanner sc = new Scanner(System.in);
    String[] keys = sc.nextLine().split("\\s+");

    for (String key : keys) {
        String porterStemTerm = PorterStemmer.stem(key);
        if (porterStemTerm.equals("Invalid term"))
            porterStemTerm = key;
        Set<String> result = myQuery.query(porterStemTerm);
        Iterator<String> iter = result.iterator();
        while (iter.hasNext())
            System.out.println("  - " + iter.next());
    }
    
    myQuery.close();
  }
}

