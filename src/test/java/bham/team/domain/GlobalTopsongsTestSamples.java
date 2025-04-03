package bham.team.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class GlobalTopsongsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static GlobalTopsongs getGlobalTopsongsSample1() {
        return new GlobalTopsongs().id(1L).playCount(1).year(1);
    }

    public static GlobalTopsongs getGlobalTopsongsSample2() {
        return new GlobalTopsongs().id(2L).playCount(2).year(2);
    }

    public static GlobalTopsongs getGlobalTopsongsRandomSampleGenerator() {
        return new GlobalTopsongs().id(longCount.incrementAndGet()).playCount(intCount.incrementAndGet()).year(intCount.incrementAndGet());
    }
}
