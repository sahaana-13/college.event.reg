import java.util.*;
public class Main {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        EventManager em = new EventManager();
        StudentManager sm = new StudentManager();

        while(true){
            System.out.println("\n--- College Event Registration ---");
            System.out.println("1. Admin: Add Event");
            System.out.println("2. Admin: View Events");
            System.out.println("3. Admin: Delete Event");
            System.out.println("4. Student: Register");
            System.out.println("5. Student: View Events");
            System.out.println("0. Exit");
            System.out.print("Choice: ");
            int ch = sc.nextInt();
            sc.nextLine(); // consume newline

            switch(ch){
                case 1:
                    System.out.print("Event ID: "); String eid = sc.nextLine();
                    System.out.print("Event Name: "); String ename = sc.nextLine();
                    System.out.print("Category: "); String cat = sc.nextLine();
                    System.out.print("Date (YYYY-MM-DD): "); String date = sc.nextLine();
                    em.addEvent(new Event(eid, ename, cat, date));
                    break;
                case 2: em.viewEvents(); break;
                case 3:
                    System.out.print("Enter Event ID to delete: ");
                    String del = sc.nextLine();
                    em.deleteEvent(del);
                    break;
                case 4:
                    System.out.print("Student ID: "); String sid = sc.nextLine();
                    System.out.print("Student Name: "); String sname = sc.nextLine();
                    System.out.print("Password: "); String spass = sc.nextLine();
                    sm.addStudent(new Student(sid, sname, spass));
                    System.out.println("Student Registered. Now choose Event to register:");
                    em.viewEvents();
                    System.out.print("Event ID: "); String regId = sc.nextLine();
                    System.out.println(sname + " registered for Event: " + regId);
                    break;
                case 5: em.viewEvents(); break;
                case 0: System.exit(0);
                default: System.out.println("Invalid choice!");
            }
        }
    }
}
