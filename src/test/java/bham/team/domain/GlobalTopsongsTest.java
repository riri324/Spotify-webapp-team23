package bham.team.domain;

import static bham.team.domain.GlobalTopsongsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GlobalTopsongsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GlobalTopsongs.class);
        GlobalTopsongs globalTopsongs1 = getGlobalTopsongsSample1();
        GlobalTopsongs globalTopsongs2 = new GlobalTopsongs();
        assertThat(globalTopsongs1).isNotEqualTo(globalTopsongs2);

        globalTopsongs2.setId(globalTopsongs1.getId());
        assertThat(globalTopsongs1).isEqualTo(globalTopsongs2);

        globalTopsongs2 = getGlobalTopsongsSample2();
        assertThat(globalTopsongs1).isNotEqualTo(globalTopsongs2);
    }
}
