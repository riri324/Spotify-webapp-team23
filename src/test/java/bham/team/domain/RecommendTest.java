package bham.team.domain;

import static bham.team.domain.RecommendTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RecommendTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Recommend.class);
        Recommend recommend1 = getRecommendSample1();
        Recommend recommend2 = new Recommend();
        assertThat(recommend1).isNotEqualTo(recommend2);

        recommend2.setId(recommend1.getId());
        assertThat(recommend1).isEqualTo(recommend2);

        recommend2 = getRecommendSample2();
        assertThat(recommend1).isNotEqualTo(recommend2);
    }
}
