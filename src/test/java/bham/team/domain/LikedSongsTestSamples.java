package bham.team.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LikedSongsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static LikedSongs getLikedSongsSample1() {
        return new LikedSongs().id(1L).likeID(1);
    }

    public static LikedSongs getLikedSongsSample2() {
        return new LikedSongs().id(2L).likeID(2);
    }

    public static LikedSongs getLikedSongsRandomSampleGenerator() {
        return new LikedSongs().id(longCount.incrementAndGet()).likeID(intCount.incrementAndGet());
    }
}
