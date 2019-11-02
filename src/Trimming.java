import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class Trimming {
    private BufferedImage image;
    private BufferedImage img;
    private int w;
    private int h;
    private String path;

    public void setPath(String path) {
        this.path = path;
    }

    public void reload(BufferedImage image){
        this.image = image;
        w=image.getWidth();
        h=image.getHeight();
    }

    public BufferedImage doIt(Point pt,int dire){
        System.out.println(pt+" "+w+" "+h);
        switch (dire){
            case 0://up
                test(0,(int)pt.getY(),w,h-(int)pt.getY());
                return img;
            case 1://left
                test((int)pt.getX(),0,w-(int)pt.getX(),h);
                return img;
            case 2://down
                test(0,0,w,h-(h-(int)pt.getY()));
                return img;
            case 3://right
                test(0,0,w-(w-(int)pt.getX()),h);
                return img;
            default:
                System.out.println("direction error");
                return img;
        }
    }

    private void test(int x,int y,int w,int h){
        try {
            BufferedImage input = ImageIO.read(new File(path+".png"));
            BufferedImage output = input.getSubimage(x, y, w, h);
            ImageIO.write(output, "PNG", new File(path+".png"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
