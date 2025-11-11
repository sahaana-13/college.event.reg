import java.io.*;
import java.util.*;

public class StudentManager {
    private List<Student> students = new ArrayList<>();
    private final String file = "backend/data/students.txt";

    public StudentManager(){
        loadStudents();
    }

    public void addStudent(Student s){
        students.add(s);
        saveStudents();
    }

    public Student login(String id, String password){
        for(Student s: students){
            if(s.getId().equals(id) && s.getPassword().equals(password)) return s;
        }
        return null;
    }

    private void loadStudents(){
        try(BufferedReader br = new BufferedReader(new FileReader(file))){
            String line;
            while((line = br.readLine()) != null){
                String[] data = line.split(",");
                if(data.length == 3){
                    students.add(new Student(data[0], data[1], data[2]));
                }
            }
        } catch(Exception e){ /* file empty */ }
    }

    private void saveStudents(){
        try(PrintWriter pw = new PrintWriter(new FileWriter(file))){
            for(Student s: students){
                pw.println(s.getId() + "," + s.getName() + "," + s.getPassword());
            }
        } catch(Exception e){ e.printStackTrace(); }
    }
}
