package bham.team.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RecommendDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(RecommendDTO.class);
        RecommendDTO recommendDTO1 = new RecommendDTO();
        recommendDTO1.setId(1L);
        RecommendDTO recommendDTO2 = new RecommendDTO();
        assertThat(recommendDTO1).isNotEqualTo(recommendDTO2);
        recommendDTO2.setId(recommendDTO1.getId());
        assertThat(recommendDTO1).isEqualTo(recommendDTO2);
        recommendDTO2.setId(2L);
        assertThat(recommendDTO1).isNotEqualTo(recommendDTO2);
        recommendDTO1.setId(null);
        assertThat(recommendDTO1).isNotEqualTo(recommendDTO2);
    }
}
