import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.File;
import java.io.IOException;

public class Json {
    private ObjectMapper mapper;
    private JsonNode jnode;
    private ArrayNode anode;
    private String path;

    public void reload(){
        mapper = new ObjectMapper();
        try{
            jnode = mapper.readTree(new File(path+"\\pic.json"));
            createAnode();
            System.out.println("path");
        }catch (IOException e){
            System.out.println(path);
        }
    }

    public void setPath(String path){
        System.out.println(path);
        this.path=path;
    }

    private void createAnode(){
        anode = mapper.createArrayNode();
        for(JsonNode node : jnode){
            anode.add(node);
        }
    }

    public void addAnode(String src,int num,int dir){
        ObjectNode node = mapper.createObjectNode();
        node.put("src",src);
        node.put("num",num);
        if(dir!=-1){
            node.put("dir",dir);
        }
        anode.add(node);
    }

    public void removeAnode(int index){
        anode.remove(index);
    }

    public void outputJsonFile(){
        try {
            String prettyJson = null;
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File(path+"\\pic.json"),anode);

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }catch (IOException e){
            System.out.println("Json:IOException:output");
        }
    }

    public String[] getAnode(){
        String out[]=new String[anode.size()];
        int i=0;
        for(JsonNode node : anode){
            if(node.size()==2){
                out[i++]=node.get("src").asText()+" : "+node.get("num").asText();
            }else{
                out[i++]=node.get("src").asText()+" : "+node.get("num").asText() +" : "+node.get("num").asText();
            }

        }
        return out;
    }

    @Override
    public String toString() {
        try{
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(anode);
        }catch (JsonProcessingException e){
            return "sorry failure toString";
        }

    }
}