package bham.team.domain;

import static bham.team.domain.ConcertTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConcertTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Concert.class);
        Concert concert1 = getConcertSample1();
        Concert concert2 = new Concert();
        assertThat(concert1).isNotEqualTo(concert2);

        concert2.setId(concert1.getId());
        assertThat(concert1).isEqualTo(concert2);

        concert2 = getConcertSample2();
        assertThat(concert1).isNotEqualTo(concert2);
    }
}
