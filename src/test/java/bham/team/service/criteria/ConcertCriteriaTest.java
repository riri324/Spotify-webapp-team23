package bham.team.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class ConcertCriteriaTest {

    @Test
    void newConcertCriteriaHasAllFiltersNullTest() {
        var concertCriteria = new ConcertCriteria();
        assertThat(concertCriteria).is(criteriaFiltersAre(filter -> filter == null));
    }

    @Test
    void concertCriteriaFluentMethodsCreatesFiltersTest() {
        var concertCriteria = new ConcertCriteria();

        setAllFilters(concertCriteria);

        assertThat(concertCriteria).is(criteriaFiltersAre(filter -> filter != null));
    }

    @Test
    void concertCriteriaCopyCreatesNullFilterTest() {
        var concertCriteria = new ConcertCriteria();
        var copy = concertCriteria.copy();

        assertThat(concertCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter == null)),
            criteria -> assertThat(criteria).isEqualTo(concertCriteria)
        );
    }

    @Test
    void concertCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var concertCriteria = new ConcertCriteria();
        setAllFilters(concertCriteria);

        var copy = concertCriteria.copy();

        assertThat(concertCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(filter -> filter != null)),
            criteria -> assertThat(criteria).isEqualTo(concertCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var concertCriteria = new ConcertCriteria();

        assertThat(concertCriteria).hasToString("ConcertCriteria{}");
    }

    private static void setAllFilters(ConcertCriteria concertCriteria) {
        concertCriteria.id();
        concertCriteria.artistName();
        concertCriteria.venueName();
        concertCriteria.country();
        concertCriteria.region();
        concertCriteria.eventDate();
        concertCriteria.ticketmasterEventId();
        concertCriteria.imageUrl();
        concertCriteria.externalUrl();
        concertCriteria.distinct();
    }

    private static Condition<ConcertCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getArtistName()) &&
                condition.apply(criteria.getVenueName()) &&
                condition.apply(criteria.getCountry()) &&
                condition.apply(criteria.getRegion()) &&
                condition.apply(criteria.getEventDate()) &&
                condition.apply(criteria.getTicketmasterEventId()) &&
                condition.apply(criteria.getImageUrl()) &&
                condition.apply(criteria.getExternalUrl()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<ConcertCriteria> copyFiltersAre(ConcertCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getArtistName(), copy.getArtistName()) &&
                condition.apply(criteria.getVenueName(), copy.getVenueName()) &&
                condition.apply(criteria.getCountry(), copy.getCountry()) &&
                condition.apply(criteria.getRegion(), copy.getRegion()) &&
                condition.apply(criteria.getEventDate(), copy.getEventDate()) &&
                condition.apply(criteria.getTicketmasterEventId(), copy.getTicketmasterEventId()) &&
                condition.apply(criteria.getImageUrl(), copy.getImageUrl()) &&
                condition.apply(criteria.getExternalUrl(), copy.getExternalUrl()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
