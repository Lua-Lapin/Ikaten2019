import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;

public class DrawCanvas extends JPanel {
    private BufferedImage img;
    public DrawCanvas(BufferedImage img){
        this.img = img;
    }
    @Override
    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.drawImage(img,  0, 0,this);
    }
    public void setImg(BufferedImage img){
        this.img = img;
    }

    public void paint(){
        Graphics g=getGraphics();
        g.drawImage(img,  10, 10,this);
        g.dispose();
    }
    public void clear(){
        Graphics g=getGraphics();		// Graphics を取り出して、
        g.setColor(getBackground());	// 描画色を背景色にして、
        g.fillRect(0,0,400,400);	// その大きさの矩形を塗りつぶす。
        g.dispose();			// Graphics を破棄する。
    }
}