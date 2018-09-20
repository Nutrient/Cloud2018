package mx.iteso.desi.cloud.keyvalue;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.*;
import javafx.scene.control.Tab;
import mx.iteso.desi.cloud.lp1.Config;

import java.util.*;


public class DynamoDBStorage extends BasicKeyValueStore {
    AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().withRegion(Config.amazonRegion).build();
    DynamoDB dynamoDB = new DynamoDB(client);
    String dbName;

    // Simple autoincrement counter to make sure we have unique entries
    int inx = 0;

    Set<String> attributesToGet = new HashSet<String>();

    public DynamoDBStorage(String dbName) {
        init(dbName);
        this.dbName = dbName;
    }

    public int getInx() {
        return inx++;
    }

    public void init(String dbName){

        try {
            System.out.println("Creating table " + dbName);
            List<KeySchemaElement> keySchema = new ArrayList<KeySchemaElement>();
            List<AttributeDefinition> attributeDefinitions= new ArrayList<AttributeDefinition>();

            keySchema.add(new KeySchemaElement().withAttributeName("Keyword").withKeyType(KeyType.HASH));
            keySchema.add(new KeySchemaElement().withAttributeName("inx").withKeyType(KeyType.RANGE));

            attributeDefinitions.add(new AttributeDefinition().withAttributeName("Keyword").withAttributeType("S"));
            attributeDefinitions.add(new AttributeDefinition().withAttributeName("inx").withAttributeType("N"));

            CreateTableRequest request = new CreateTableRequest()
                    .withTableName(dbName)
                    .withKeySchema(keySchema)
                    .withAttributeDefinitions(attributeDefinitions)
                    .withProvisionedThroughput(new ProvisionedThroughput()
                            .withReadCapacityUnits(1L)
                            .withWriteCapacityUnits(1L));

            Table table = dynamoDB.createTable(request);
            table.waitForActive();

        }
        catch (ResourceInUseException e){
            System.out.println("Table already exists");
        }
        catch (Exception e){
            System.out.println(e.getStackTrace());
        }


        //System.out.println("Table description: " + tableDescription.getTableStatus());
    }

    @Override
    public Set<String> get(String search) {
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
        HashSet<String> itemList = new HashSet<String>();
        try {


        }
        catch (Exception e){
            System.out.println(e.toString());
        }

        return itemList;
    }

    @Override
    public boolean exists(String search) {

        Table table = dynamoDB.getTable(dbName);

        QuerySpec spec = new QuerySpec()
                .withKeyConditionExpression("Keyword = :v_id")
                .withValueMap(new ValueMap().withString(":v_id", search));

        return  table.query(spec).iterator().hasNext();
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public Set<String> getPrefix(String search) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void addToSet(String keyword, String value) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    @Override
    public void addToSet(List<Item> collection){
        Table table = dynamoDB.getTable(dbName);
        TableWriteItems forumTableWriteItems = new TableWriteItems(dbName)
                .withItemsToPut(collection);

        dynamoDB.batchWriteItem(forumTableWriteItems);
    }

    @Override
    public void put(String keyword, String value) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void close() {
        dynamoDB.shutdown();
        System.out.println("Connection to " + dbName + " has been closed");
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
    @Override
    public boolean supportsPrefixes() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void sync() {
    }

    @Override
    public boolean isCompressible() {
        return false;
    }

    @Override
    public boolean supportsMoreThan256Attributes() {
        return true;
    }

}
