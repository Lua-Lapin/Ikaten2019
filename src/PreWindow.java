import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseEvent;
import java.awt.image.*;
import java.io.File;
import java.io.IOException;
import java.util.Random;

public class PreWindow extends JFrame {
    private JLabel j1;
    private JPanel p0;
    private JPanel p1;
    private JPanel p2;
    private JTextField t2;
    private JButton r0B;
    private JButton r90B;
    private JButton r180B;
    private JButton r270B;
    private JButton trimU;
    private JButton trimL;
    private JButton trimD;
    private JButton trimR;
    private JButton success;
    private JButton succ;
    private DrawCanvas can;
    private Point pt;

    private String path;

    private BufferedImage image;
    private BufferedImage img;

    private Trimming trim;
    private MLisner ml;
    private Json jsonData;
    private String name;
    private String pngName;

    public PreWindow(String path,String jsonPath,String pngName){
        this.path=path;
        name=jsonPath;
        this.pngName=pngName;
        jsonData =new Json();
        setTitle("previwe");
        setBounds(700, 100, 1100, 1100);//123;
        rotate(path,0);
        if(img.getHeight()>400 && img.getWidth()>400) {
            img = scaleImage(700);
        }
        setting();
        setVisible(true);
        preBEve(0);
    }
    private void useJson(){
        Random rand=new Random();
        jsonData.setPath(name);
        jsonData.reload();
        jsonData.addAnode("pic/"+pngName+".png",rand.nextInt(2)+1,rand.nextInt(2));
        jsonData.outputJsonFile();
    }

    private void setting(){
        j1=new JLabel();
        p0=new JPanel();
        p1=new JPanel();
        p2=new JPanel();
        r0B=new JButton("0");
        r90B=new JButton("90");
        r180B=new JButton("180");
        r270B=new JButton("270");
        trimU=new JButton("up");
        trimL=new JButton("left");
        trimD=new JButton("down");
        trimR=new JButton("right");
        success=new JButton("success");
        succ=new JButton("succ");
        t2=new JTextField("300");
        trim = new Trimming();
        ml = new MLisner();

        trim.setPath(path);

        p0.setLayout(new BoxLayout(p0, BoxLayout.Y_AXIS));
        p1.setLayout(new BoxLayout(p1, BoxLayout.LINE_AXIS));
        p2.setLayout(new BoxLayout(p2, BoxLayout.LINE_AXIS));

        getRootPane().setDefaultButton(success);
        buttonSet();

        p1.add(r0B);
        p1.add(r90B);
        p1.add(r180B);
        p1.add(r270B);
        p2.add(j1);
        p2.add(trimU);
        p2.add(trimL);
        p2.add(trimD);
        p2.add(trimR);
        p2.add(success);
        p0.add(p1);
        p0.add(p2);
        can = new DrawCanvas(img);
        can.addMouseListener(ml);
        getContentPane().add(p0, BorderLayout.NORTH);
        getContentPane().add(can, BorderLayout.CENTER);
        repaint();
    }

    private void buttonSet(){
        r0B.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent e) {
                preBEve(0);
            }
        });
        r90B.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent e) {
                preBEve(90);
            }
        });
        r180B.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent e) {
                preBEve(180);
            }
        });
        r270B.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent e) {
                preBEve(270);
            }
        });
        trimR.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent e) {
                useDraw(3);
            }
        });
        trimU.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent e) {
                useDraw(0);
            }
        });
        trimL.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent e) {
               useDraw(1);
            }
        });
        trimD.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent e) {
                useDraw(2);
            }
        });
        success.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent e) {
                try{
                    Conversion con = new Conversion();
                    BufferedImage i=ImageIO.read(new File(path+".png"));
                    i=scaleImage(Integer.valueOf(t2.getText()));
//                    i=con.doArufa(i,Integer.valueOf(t1.getText())/5);
                    i=con.test(i);
//                    con.writeImage(path);
                    ImageIO.write(i,"png",new File(path+".png"));
                    useJson();
                    System.out.println("Process Succesed");
                    dispose();
                }catch (IOException ev) {
                    System.out.println("image file write error.");
                }

//                dispose();
            }
        });
        succ.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent e) {
            }
        });
    }
    private void preBEve(int angle){
        rotate(path,angle);
        img=scaleImage(700);
        can.clear();
        can.setImg(img);
        can.paint();
        repaint();
        conBEve();
    }
    private void conBEve(){
        try{
            ImageIO.write(img,"png",new File(path+".png"));
            System.out.println("Process Succesed");
//            this.dispose();
        }catch (Exception e) {
            System.out.println("image file write error.");
        }
    }

    private void useDraw(int dire){
        System.out.println(ml.getMousePoint());
        pt=ml.getMousePoint();
        trim.reload(img);
        trim.doIt(pt,dire);
        try{
            img =ImageIO.read(new File(path+".png"));
        }catch (IOException e){
            e.printStackTrace();
        }
        can.clear();
        can.setImg(img);
        can.paint();
        repaint();
    }

    private  BufferedImage scaleImage(int max)  {
        // ポイント１．ImageIconクラスでアイコンとして画像を読み込みます。\
        int width = img.getWidth();    // オリジナル画像の幅
        int height = img.getHeight();  // オリジナル画像の高さ

        // 縦横の比率から、scaleを決める
        double widthScale = (double) max / (double) width;
        double heightScale = (double) max / (double) height;
        double scale = widthScale < heightScale ? widthScale : heightScale;

        ImageFilter filter = new AreaAveragingScaleFilter(
                (int) (img.getWidth() * scale), (int) (img.getHeight() * scale));
        ImageProducer p = new FilteredImageSource(img.getSource(), filter);
        Image dstImage = Toolkit.getDefaultToolkit().createImage(p);
        BufferedImage dst = new BufferedImage(
                dstImage.getWidth(null), dstImage.getHeight(null), BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = dst.createGraphics();
        g.drawImage(dstImage, 0, 0, null);
        g.dispose();
        return dst;
    }

    private void rotate(String path,double angle){
        System.out.println("noooooo");
        Previwe pre = new Previwe();
        try{
            image = ImageIO.read(new File(path+"_0.png"));
            img = pre.rotateImage(angle/180*Math.PI,image);
            System.out.println("okkkkkkk");
        }catch (IOException e){
            e.printStackTrace();
        }
    }
}
