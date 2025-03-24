package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SongTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Song getSongSample1() {
        return new Song().id(1L).songId("songId1").trackName("trackName1");
    }

    public static Song getSongSample2() {
        return new Song().id(2L).songId("songId2").trackName("trackName2");
    }

    public static Song getSongRandomSampleGenerator() {
        return new Song().id(longCount.incrementAndGet()).songId(UUID.randomUUID().toString()).trackName(UUID.randomUUID().toString());
    }
}
