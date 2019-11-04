import java.awt.*;
import java.awt.image.*;

public class EditImage {
    //画像をスケーリングします
    //maxは縦または横の最大サイズ
    //縦横比は維持されます
    private BufferedImage scaleImage(BufferedImage image, int max){
        int width = image.getWidth();    // オリジナル画像の幅
        int height = image.getHeight();  // オリジナル画像の高さ

        // 縦横の比率から、scaleを決める
        double widthScale = (double) max / (double) width;
        double heightScale = (double) max / (double) height;
        double scale = widthScale < heightScale ? widthScale : heightScale;

        ImageFilter filter = new AreaAveragingScaleFilter(
                (int) (image.getWidth() * scale), (int) (image.getHeight() * scale));
        ImageProducer p = new FilteredImageSource(image.getSource(), filter);
        Image dstImage = Toolkit.getDefaultToolkit().createImage(p);
        BufferedImage dst = new BufferedImage(
                dstImage.getWidth(null), dstImage.getHeight(null), BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = dst.createGraphics();
        g.drawImage(dstImage, 0, 0, null);
        g.dispose();
        return dst;
    }
}
