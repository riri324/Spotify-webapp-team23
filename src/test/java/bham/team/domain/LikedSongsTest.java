package bham.team.domain;

import static bham.team.domain.LikedSongsTestSamples.*;
import static bham.team.domain.SongTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LikedSongsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LikedSongs.class);
        LikedSongs likedSongs1 = getLikedSongsSample1();
        LikedSongs likedSongs2 = new LikedSongs();
        assertThat(likedSongs1).isNotEqualTo(likedSongs2);

        likedSongs2.setId(likedSongs1.getId());
        assertThat(likedSongs1).isEqualTo(likedSongs2);

        likedSongs2 = getLikedSongsSample2();
        assertThat(likedSongs1).isNotEqualTo(likedSongs2);
    }

    @Test
    void songTest() {
        LikedSongs likedSongs = getLikedSongsRandomSampleGenerator();
        Song songBack = getSongRandomSampleGenerator();

        likedSongs.setSong(songBack);
        assertThat(likedSongs.getSong()).isEqualTo(songBack);

        likedSongs.song(null);
        assertThat(likedSongs.getSong()).isNull();
    }
}
