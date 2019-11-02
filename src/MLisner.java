import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

public class MLisner extends MouseAdapter implements MouseListener {
    public Point mousePoint;

    public Point getMousePoint(){
        return mousePoint;
    }

    public void mouseClicked(MouseEvent e) {
        System.out.println("clicked");
        mousePoint = e.getPoint();
        System.out.println(e.getPoint());
    }

    @Override
    public void mousePressed(MouseEvent e) {}
    @Override
    public void mouseReleased(MouseEvent e) {}
    @Override
    public void mouseEntered(MouseEvent e) {}
    @Override
    public void mouseExited(MouseEvent e) {}
}
