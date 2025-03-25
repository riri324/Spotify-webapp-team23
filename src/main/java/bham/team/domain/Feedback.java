package bham.team.domain;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

//K7's entity
@Entity
@Table(name ="feedback")

public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private long feedbackId;

    @NotBlank(message = "Please enter your username")
    @Column(unique = true)
    private String username;

    @NotBlank(message = "Please enter your Email")
    @Email
    @Column(unique = true)
    private String userEmail;

    @Column
    private Integer userPhoneNum;

    @NotBlank(message = "Please enter your feedback")
    @Column(columnDefinition = "TEXT")
    private String message;

    @Column
    private Integer rating;


    public Feedback(long feedbackId, String username, String userEmail, Integer userPhoneNum, String message, Integer rating) {

        this.feedbackId = feedbackId;
        this.username = username;
        this.userEmail = userEmail;
        this.userPhoneNum = userPhoneNum;
        this.message = message;
        this.rating = rating;


    }

    // do I need this?:
    public Feedback() {

    }


    public long getFeedbackId() {
        return feedbackId;
    }
    public void setFeedbackId(long feedbackId) {
        feedbackId = feedbackId;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserEmail() {
        return userEmail;
    }
    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Integer getUserPhoneNum() {
        return userPhoneNum;
    }
    public void setUserPhoneNum(Integer userPhoneNum) {
        this.userPhoneNum = userPhoneNum;
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }


    public Integer getRating() {
        return rating;
    }
    public void setRating(Integer rating) {
        this.rating = rating;
    }


}


