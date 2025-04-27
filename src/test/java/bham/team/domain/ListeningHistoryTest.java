package bham.team.domain;

import static bham.team.domain.ListeningHistoryTestSamples.*;
import static bham.team.domain.SongTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ListeningHistoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ListeningHistory.class);
        ListeningHistory listeningHistory1 = getListeningHistorySample1();
        ListeningHistory listeningHistory2 = new ListeningHistory();
        assertThat(listeningHistory1).isNotEqualTo(listeningHistory2);

        listeningHistory2.setId(listeningHistory1.getId());
        assertThat(listeningHistory1).isEqualTo(listeningHistory2);

        listeningHistory2 = getListeningHistorySample2();
        assertThat(listeningHistory1).isNotEqualTo(listeningHistory2);
    }

    @Test
    void songTest() {
        ListeningHistory listeningHistory = getListeningHistoryRandomSampleGenerator();
        Song songBack = getSongRandomSampleGenerator();

        listeningHistory.addSong(songBack);
        assertThat(listeningHistory.getSongs()).containsOnly(songBack);

        listeningHistory.removeSong(songBack);
        assertThat(listeningHistory.getSongs()).doesNotContain(songBack);

        listeningHistory.songs(new HashSet<>(Set.of(songBack)));
        assertThat(listeningHistory.getSongs()).containsOnly(songBack);

        listeningHistory.setSongs(new HashSet<>());
        assertThat(listeningHistory.getSongs()).doesNotContain(songBack);
    }
}
