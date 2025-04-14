package bham.team.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Feedback.
 */
@Entity
@Table(name = "feedback")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Feedback implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "feedback_id", nullable = false, unique = true)
    private Long feedbackID;

    @NotNull(message = "Please enter your username")
    @Size(max = 100)
    @Column(name = "user_name", length = 100, nullable = false, unique = true)
    private String userName;

    @NotNull(message = "Please enter your Email")
    @Size(max = 100)
    @Email
    @Column(name = "user_email", length = 100, nullable = false)
    private String userEmail;

    @Size(max = 25)
    @Column(name = "user_phone_num", length = 25)
    private String userPhoneNum;

    @NotBlank(message = "Please enter your feedback")
    @Size(max = 2048)
    @Column(name = "message", length = 2048, columnDefinition = "TEXT")
    private String message;

    @NotNull
    @Min(value = 1)
    @Max(value = 5)
    @Column(name = "rating", nullable = false)
    private Integer rating;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Feedback id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFeedbackID() {
        return this.feedbackID;
    }

    public Feedback feedbackID(Long feedbackID) {
        this.setFeedbackID(feedbackID);
        return this;
    }

    public void setFeedbackID(Long feedbackID) {
        this.feedbackID = feedbackID;
    }

    public String getUserName() {
        return this.userName;
    }

    public Feedback userName(String userName) {
        this.setUserName(userName);
        return this;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return this.userEmail;
    }

    public Feedback userEmail(String userEmail) {
        this.setUserEmail(userEmail);
        return this;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhoneNum() {
        return this.userPhoneNum;
    }

    public Feedback userPhoneNum(String userPhoneNum) {
        this.setUserPhoneNum(userPhoneNum);
        return this;
    }

    public void setUserPhoneNum(String userPhoneNum) {
        this.userPhoneNum = userPhoneNum;
    }

    public String getMessage() {
        return this.message;
    }

    public Feedback message(String message) {
        this.setMessage(message);
        return this;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getRating() {
        return this.rating;
    }

    public Feedback rating(Integer rating) {
        this.setRating(rating);
        return this;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Feedback)) {
            return false;
        }
        return getId() != null && getId().equals(((Feedback) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Feedback{" +
            "id=" + getId() +
            ", feedbackID=" + getFeedbackID() +
            ", userName='" + getUserName() + "'" +
            ", userEmail='" + getUserEmail() + "'" +
            ", userPhoneNum='" + getUserPhoneNum() + "'" +
            ", message='" + getMessage() + "'" +
            ", rating=" + getRating() +
            "}";
    }
}
