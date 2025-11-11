public class Event {
    private String id;
    private String name;
    private String category;
    private String date;

    public Event(String id, String name, String category, String date){
        this.id = id;
        this.name = name;
        this.category = category;
        this.date = date;
    }

    // Getters & Setters
    public String getId(){ return id; }
    public String getName(){ return name; }
    public String getCategory(){ return category; }
    public String getDate(){ return date; }
}
