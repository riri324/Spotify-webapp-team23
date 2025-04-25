package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class RecommendTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Recommend getRecommendSample1() {
        return new Recommend().id(1L).userId("userId1").recommendedUserId("recommendedUserId1").commonSongsCount(1);
    }

    public static Recommend getRecommendSample2() {
        return new Recommend().id(2L).userId("userId2").recommendedUserId("recommendedUserId2").commonSongsCount(2);
    }

    public static Recommend getRecommendRandomSampleGenerator() {
        return new Recommend()
            .id(longCount.incrementAndGet())
            .userId(UUID.randomUUID().toString())
            .recommendedUserId(UUID.randomUUID().toString())
            .commonSongsCount(intCount.incrementAndGet());
    }
}
