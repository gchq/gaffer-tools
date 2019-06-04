package uk.gov.gchq.gaffer.functions;

import org.roaringbitmap.RoaringBitmap;
import uk.gov.gchq.koryphe.function.KorypheFunction;

public class ToRoaringBitmap extends KorypheFunction<Integer, RoaringBitmap> {

    @Override
    public RoaringBitmap apply(Integer integer) {
        RoaringBitmap rmb = new RoaringBitmap();
        rmb.add(integer);
        return rmb;
    }
}
