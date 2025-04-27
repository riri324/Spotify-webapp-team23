package bham.team.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link bham.team.domain.Concert} entity. This class is used
 * in {@link bham.team.web.rest.ConcertResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /concerts?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ConcertCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter artistName;

    private StringFilter venueName;

    private StringFilter country;

    private StringFilter region;

    private ZonedDateTimeFilter eventDate;

    private StringFilter ticketmasterEventId;

    private StringFilter imageUrl;

    private StringFilter externalUrl;

    private Boolean distinct;

    public ConcertCriteria() {}

    public ConcertCriteria(ConcertCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.artistName = other.optionalArtistName().map(StringFilter::copy).orElse(null);
        this.venueName = other.optionalVenueName().map(StringFilter::copy).orElse(null);
        this.country = other.optionalCountry().map(StringFilter::copy).orElse(null);
        this.region = other.optionalRegion().map(StringFilter::copy).orElse(null);
        this.eventDate = other.optionalEventDate().map(ZonedDateTimeFilter::copy).orElse(null);
        this.ticketmasterEventId = other.optionalTicketmasterEventId().map(StringFilter::copy).orElse(null);
        this.imageUrl = other.optionalImageUrl().map(StringFilter::copy).orElse(null);
        this.externalUrl = other.optionalExternalUrl().map(StringFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public ConcertCriteria copy() {
        return new ConcertCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public Optional<LongFilter> optionalId() {
        return Optional.ofNullable(id);
    }

    public LongFilter id() {
        if (id == null) {
            setId(new LongFilter());
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getArtistName() {
        return artistName;
    }

    public Optional<StringFilter> optionalArtistName() {
        return Optional.ofNullable(artistName);
    }

    public StringFilter artistName() {
        if (artistName == null) {
            setArtistName(new StringFilter());
        }
        return artistName;
    }

    public void setArtistName(StringFilter artistName) {
        this.artistName = artistName;
    }

    public StringFilter getVenueName() {
        return venueName;
    }

    public Optional<StringFilter> optionalVenueName() {
        return Optional.ofNullable(venueName);
    }

    public StringFilter venueName() {
        if (venueName == null) {
            setVenueName(new StringFilter());
        }
        return venueName;
    }

    public void setVenueName(StringFilter venueName) {
        this.venueName = venueName;
    }

    public StringFilter getCountry() {
        return country;
    }

    public Optional<StringFilter> optionalCountry() {
        return Optional.ofNullable(country);
    }

    public StringFilter country() {
        if (country == null) {
            setCountry(new StringFilter());
        }
        return country;
    }

    public void setCountry(StringFilter country) {
        this.country = country;
    }

    public StringFilter getRegion() {
        return region;
    }

    public Optional<StringFilter> optionalRegion() {
        return Optional.ofNullable(region);
    }

    public StringFilter region() {
        if (region == null) {
            setRegion(new StringFilter());
        }
        return region;
    }

    public void setRegion(StringFilter region) {
        this.region = region;
    }

    public ZonedDateTimeFilter getEventDate() {
        return eventDate;
    }

    public Optional<ZonedDateTimeFilter> optionalEventDate() {
        return Optional.ofNullable(eventDate);
    }

    public ZonedDateTimeFilter eventDate() {
        if (eventDate == null) {
            setEventDate(new ZonedDateTimeFilter());
        }
        return eventDate;
    }

    public void setEventDate(ZonedDateTimeFilter eventDate) {
        this.eventDate = eventDate;
    }

    public StringFilter getTicketmasterEventId() {
        return ticketmasterEventId;
    }

    public Optional<StringFilter> optionalTicketmasterEventId() {
        return Optional.ofNullable(ticketmasterEventId);
    }

    public StringFilter ticketmasterEventId() {
        if (ticketmasterEventId == null) {
            setTicketmasterEventId(new StringFilter());
        }
        return ticketmasterEventId;
    }

    public void setTicketmasterEventId(StringFilter ticketmasterEventId) {
        this.ticketmasterEventId = ticketmasterEventId;
    }

    public StringFilter getImageUrl() {
        return imageUrl;
    }

    public Optional<StringFilter> optionalImageUrl() {
        return Optional.ofNullable(imageUrl);
    }

    public StringFilter imageUrl() {
        if (imageUrl == null) {
            setImageUrl(new StringFilter());
        }
        return imageUrl;
    }

    public void setImageUrl(StringFilter imageUrl) {
        this.imageUrl = imageUrl;
    }

    public StringFilter getExternalUrl() {
        return externalUrl;
    }

    public Optional<StringFilter> optionalExternalUrl() {
        return Optional.ofNullable(externalUrl);
    }

    public StringFilter externalUrl() {
        if (externalUrl == null) {
            setExternalUrl(new StringFilter());
        }
        return externalUrl;
    }

    public void setExternalUrl(StringFilter externalUrl) {
        this.externalUrl = externalUrl;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public Optional<Boolean> optionalDistinct() {
        return Optional.ofNullable(distinct);
    }

    public Boolean distinct() {
        if (distinct == null) {
            setDistinct(true);
        }
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ConcertCriteria that = (ConcertCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(artistName, that.artistName) &&
            Objects.equals(venueName, that.venueName) &&
            Objects.equals(country, that.country) &&
            Objects.equals(region, that.region) &&
            Objects.equals(eventDate, that.eventDate) &&
            Objects.equals(ticketmasterEventId, that.ticketmasterEventId) &&
            Objects.equals(imageUrl, that.imageUrl) &&
            Objects.equals(externalUrl, that.externalUrl) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, artistName, venueName, country, region, eventDate, ticketmasterEventId, imageUrl, externalUrl, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ConcertCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalArtistName().map(f -> "artistName=" + f + ", ").orElse("") +
            optionalVenueName().map(f -> "venueName=" + f + ", ").orElse("") +
            optionalCountry().map(f -> "country=" + f + ", ").orElse("") +
            optionalRegion().map(f -> "region=" + f + ", ").orElse("") +
            optionalEventDate().map(f -> "eventDate=" + f + ", ").orElse("") +
            optionalTicketmasterEventId().map(f -> "ticketmasterEventId=" + f + ", ").orElse("") +
            optionalImageUrl().map(f -> "imageUrl=" + f + ", ").orElse("") +
            optionalExternalUrl().map(f -> "externalUrl=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
