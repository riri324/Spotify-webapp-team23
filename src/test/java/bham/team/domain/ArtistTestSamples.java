package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ArtistTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Artist getArtistSample1() {
        return new Artist().id(1L).artistName("artistName1").followers(1);
    }

    public static Artist getArtistSample2() {
        return new Artist().id(2L).artistName("artistName2").followers(2);
    }

    public static Artist getArtistRandomSampleGenerator() {
        return new Artist().id(longCount.incrementAndGet()).artistName(UUID.randomUUID().toString()).followers(intCount.incrementAndGet());
    }
}
