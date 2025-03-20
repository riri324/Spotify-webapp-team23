package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class AlbumTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Album getAlbumSample1() {
        return new Album().id(1L).albumID(1).albumName("albumName1").numberOfSongs(1);
    }

    public static Album getAlbumSample2() {
        return new Album().id(2L).albumID(2).albumName("albumName2").numberOfSongs(2);
    }

    public static Album getAlbumRandomSampleGenerator() {
        return new Album()
            .id(longCount.incrementAndGet())
            .albumID(intCount.incrementAndGet())
            .albumName(UUID.randomUUID().toString())
            .numberOfSongs(intCount.incrementAndGet());
    }
}
