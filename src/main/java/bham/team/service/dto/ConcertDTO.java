package bham.team.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link bham.team.domain.Concert} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ConcertDTO implements Serializable {

    private Long id;

    @NotNull
    private String artistName;

    @NotNull
    private String venueName;

    @NotNull
    private String country;

    private String region;

    @NotNull
    private ZonedDateTime eventDate;

    private String ticketmasterEventId;

    private String imageUrl;

    private String externalUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public ZonedDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(ZonedDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public String getTicketmasterEventId() {
        return ticketmasterEventId;
    }

    public void setTicketmasterEventId(String ticketmasterEventId) {
        this.ticketmasterEventId = ticketmasterEventId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getExternalUrl() {
        return externalUrl;
    }

    public void setExternalUrl(String externalUrl) {
        this.externalUrl = externalUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ConcertDTO)) {
            return false;
        }

        ConcertDTO concertDTO = (ConcertDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, concertDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ConcertDTO{" +
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
