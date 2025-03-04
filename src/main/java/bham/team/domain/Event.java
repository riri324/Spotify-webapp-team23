package bham.team.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Event.
 */
@Entity
@Table(name = "event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Event implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "artist_id", nullable = false)
    private Integer artistId;

    @Column(name = "datetime")
    private Instant datetime;

    @Column(name = "description")
    private String description;

    @Column(name = "title")
    private String title;

    @Column(name = "venue_name")
    private String venueName;

    @Column(name = "city")
    private String city;

    @Column(name = "region")
    private String region;

    @Column(name = "country")
    private String country;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Integer getId() {
        return this.id;
    }

    public Event id(Integer id) {
        this.setId(id);
        return this;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getArtistId() {
        return this.artistId;
    }

    public Event artistId(Integer artistId) {
        this.setArtistId(artistId);
        return this;
    }

    public void setArtistId(Integer artistId) {
        this.artistId = artistId;
    }

    public Instant getDatetime() {
        return this.datetime;
    }

    public Event datetime(Instant datetime) {
        this.setDatetime(datetime);
        return this;
    }

    public void setDatetime(Instant datetime) {
        this.datetime = datetime;
    }

    public String getDescription() {
        return this.description;
    }

    public Event description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return this.title;
    }

    public Event title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getVenueName() {
        return this.venueName;
    }

    public Event venueName(String venueName) {
        this.setVenueName(venueName);
        return this;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getCity() {
        return this.city;
    }

    public Event city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getRegion() {
        return this.region;
    }

    public Event region(String region) {
        this.setRegion(region);
        return this;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCountry() {
        return this.country;
    }

    public Event country(String country) {
        this.setCountry(country);
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Event)) {
            return false;
        }
        return getId() != null && getId().equals(((Event) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Event{" +
            "id=" + getId() +
            ", artistId=" + getArtistId() +
            ", datetime='" + getDatetime() + "'" +
            ", description='" + getDescription() + "'" +
            ", title='" + getTitle() + "'" +
            ", venueName='" + getVenueName() + "'" +
            ", city='" + getCity() + "'" +
            ", region='" + getRegion() + "'" +
            ", country='" + getCountry() + "'" +
            "}";
    }
}
