import java.io.*;
import java.util.*;

public class EventManager {
    private List<Event> events = new ArrayList<>();
    private final String file = "backend/data/events.txt";

    public EventManager(){
        loadEvents();
    }

    public void addEvent(Event e){
        events.add(e);
        saveEvents();
    }

    public void viewEvents(){
        System.out.println("ID\tName\tCategory\tDate");
        for(Event e: events){
            System.out.println(e.getId() + "\t" + e.getName() + "\t" + e.getCategory() + "\t" + e.getDate());
        }
    }

    public void deleteEvent(String id){
        events.removeIf(e -> e.getId().equals(id));
        saveEvents();
    }

    private void loadEvents(){
        try(BufferedReader br = new BufferedReader(new FileReader(file))){
            String line;
            while((line = br.readLine()) != null){
                String[] data = line.split(",");
                if(data.length == 4){
                    events.add(new Event(data[0], data[1], data[2], data[3]));
                }
            }
        } catch(Exception e){ /* file might be empty */ }
    }

    private void saveEvents(){
        try(PrintWriter pw = new PrintWriter(new FileWriter(file))){
            for(Event e: events){
                pw.println(e.getId() + "," + e.getName() + "," + e.getCategory() + "," + e.getDate());
            }
        } catch(Exception e){ e.printStackTrace(); }
    }

    public Event getEventById(String id){
        for(Event e: events){
            if(e.getId().equals(id)) return e;
        }
        return null;
    }

    public List<Event> getAllEvents(){
        return events;
    }
}
