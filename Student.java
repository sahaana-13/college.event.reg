public class Student {
    private String id;
    private String name;
    private String password;

    public Student(String id, String name, String password){
        this.id = id;
        this.name = name;
        this.password = password;
    }

    // Getters
    public String getId(){ return id; }
    public String getName(){ return name; }
    public String getPassword(){ return password; }
}
