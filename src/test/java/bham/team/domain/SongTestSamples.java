package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SongTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Song getSongSample1() {
        return new Song()
            .id(1L)
            .trackId("trackId1")
            .artists("artists1")
            .albumName("albumName1")
            .trackName("trackName1")
            .trackGenre("trackGenre1");
    }

    public static Song getSongSample2() {
        return new Song()
            .id(2L)
            .trackId("trackId2")
            .artists("artists2")
            .albumName("albumName2")
            .trackName("trackName2")
            .trackGenre("trackGenre2");
    }

    public static Song getSongRandomSampleGenerator() {
        return new Song()
            .id(longCount.incrementAndGet())
            .trackId(UUID.randomUUID().toString())
            .artists(UUID.randomUUID().toString())
            .albumName(UUID.randomUUID().toString())
            .trackName(UUID.randomUUID().toString())
            .trackGenre(UUID.randomUUID().toString());
    }
}
