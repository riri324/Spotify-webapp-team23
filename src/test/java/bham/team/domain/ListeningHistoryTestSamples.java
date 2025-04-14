package bham.team.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ListeningHistoryTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static ListeningHistory getListeningHistorySample1() {
        return new ListeningHistory().id(1L).historyID(1);
    }

    public static ListeningHistory getListeningHistorySample2() {
        return new ListeningHistory().id(2L).historyID(2);
    }

    public static ListeningHistory getListeningHistoryRandomSampleGenerator() {
        return new ListeningHistory().id(longCount.incrementAndGet()).historyID(intCount.incrementAndGet());
    }
}
