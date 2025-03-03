package bham.team.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GlobalTopsongsDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(GlobalTopsongsDTO.class);
        GlobalTopsongsDTO globalTopsongsDTO1 = new GlobalTopsongsDTO();
        globalTopsongsDTO1.setId(1L);
        GlobalTopsongsDTO globalTopsongsDTO2 = new GlobalTopsongsDTO();
        assertThat(globalTopsongsDTO1).isNotEqualTo(globalTopsongsDTO2);
        globalTopsongsDTO2.setId(globalTopsongsDTO1.getId());
        assertThat(globalTopsongsDTO1).isEqualTo(globalTopsongsDTO2);
        globalTopsongsDTO2.setId(2L);
        assertThat(globalTopsongsDTO1).isNotEqualTo(globalTopsongsDTO2);
        globalTopsongsDTO1.setId(null);
        assertThat(globalTopsongsDTO1).isNotEqualTo(globalTopsongsDTO2);
    }
}
