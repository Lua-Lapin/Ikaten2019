import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.awt.Point;


public class Previwe extends Component {
    private JLabel jl;
    private ImageIcon icon;

    private String path;
    public BufferedImage rotateImage(double angle , BufferedImage image){
        try {
            BufferedImage img = image;

            int w = img.getWidth();
            int h = img.getHeight();

            // 元画像の2つの対角線をそれぞれ回転した後、
            // X軸、Y軸に対する射影の長さを求めます。
            // X軸に対する射影の長さの大きいほうを、出力ファイルの幅、
            // Y軸に対する射影の長さの大きいほうを、出力ファイルの高さとします。
            Point diag1 = rotate(new Point(w, h), angle);
            Point diag2 = rotate(new Point(-w, h), angle);
            int width = Math.max(Math.abs(diag1.x), Math.abs(diag2.x));
            int height = Math.max(Math.abs(diag1.y), Math.abs(diag2.y));

            // 回転後の中心座標を求めます。
            double cx = (w * Math.cos(angle) - h * Math.sin(angle)) / 2.0;
            double cy = (w * Math.sin(angle) + h * Math.cos(angle)) / 2.0;

            // 元画像を原点を中心に回転します。画像の中心がずれるので、
            // 次に、回転後の中心が出力ファイルの中心となるよう、平行移動します。
            AffineTransform af = new AffineTransform();
            double dx = width / 2.0 - cx;
            double dy = height / 2.0 - cy;
            af.setToTranslation(dx, dy);
            af.rotate(angle);
            BufferedImage rotated = new BufferedImage(width, height, img.getType());
            AffineTransformOp op = new AffineTransformOp(af, AffineTransformOp.TYPE_BICUBIC);
            op.filter(img, rotated);

            return rotated;
        } catch (Exception e) {
            e.printStackTrace();
            return image;
        }
    }

    private Point rotate(Point point, double angle) {
        double th = Math.atan2(point.getY(), point.getX());
        double norm = Math.sqrt(point.getX() * point.getX() + point.getY() * point.getY());
        double x = norm * Math.cos(th - angle);
        double y = norm * Math.sin(th - angle);
        return new Point((int)Math.round(x), (int)Math.round(y));
    }
}
