package bham.team.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Concert.
 */
@Entity
@Table(name = "concert")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Concert implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "artist_name", nullable = false)
    private String artistName;

    @NotNull
    @Column(name = "venue_name", nullable = false)
    private String venueName;

    @NotNull
    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "region")
    private String region;

    @NotNull
    @Column(name = "event_date", nullable = false)
    private ZonedDateTime eventDate;

    @Column(name = "ticketmaster_event_id")
    private String ticketmasterEventId;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "external_url")
    private String externalUrl;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Concert id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getArtistName() {
        return this.artistName;
    }

    public Concert artistName(String artistName) {
        this.setArtistName(artistName);
        return this;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public String getVenueName() {
        return this.venueName;
    }

    public Concert venueName(String venueName) {
        this.setVenueName(venueName);
        return this;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getCountry() {
        return this.country;
    }

    public Concert country(String country) {
        this.setCountry(country);
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getRegion() {
        return this.region;
    }

    public Concert region(String region) {
        this.setRegion(region);
        return this;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public ZonedDateTime getEventDate() {
        return this.eventDate;
    }

    public Concert eventDate(ZonedDateTime eventDate) {
        this.setEventDate(eventDate);
        return this;
    }

    public void setEventDate(ZonedDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public String getTicketmasterEventId() {
        return this.ticketmasterEventId;
    }

    public Concert ticketmasterEventId(String ticketmasterEventId) {
        this.setTicketmasterEventId(ticketmasterEventId);
        return this;
    }

    public void setTicketmasterEventId(String ticketmasterEventId) {
        this.ticketmasterEventId = ticketmasterEventId;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public Concert imageUrl(String imageUrl) {
        this.setImageUrl(imageUrl);
        return this;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getExternalUrl() {
        return this.externalUrl;
    }

    public Concert externalUrl(String externalUrl) {
        this.setExternalUrl(externalUrl);
        return this;
    }

    public void setExternalUrl(String externalUrl) {
        this.externalUrl = externalUrl;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Concert)) {
            return false;
        }
        return getId() != null && getId().equals(((Concert) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Concert{" +
            "id=" + getId() +
            ", artistName='" + getArtistName() + "'" +
            ", venueName='" + getVenueName() + "'" +
            ", country='" + getCountry() + "'" +
            ", region='" + getRegion() + "'" +
            ", eventDate='" + getEventDate() + "'" +
            ", ticketmasterEventId='" + getTicketmasterEventId() + "'" +
            ", imageUrl='" + getImageUrl() + "'" +
            ", externalUrl='" + getExternalUrl() + "'" +
            "}";
    }
}
