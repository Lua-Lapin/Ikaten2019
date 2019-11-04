import javafx.util.Pair;

import java.awt.*;
import java.awt.image.*;
import java.io.File;
import java.io.IOException;
import java.util.Scanner;
import java.util.Stack;
import javax.imageio.ImageIO;

public class Conversion extends Component {
    private int a;
    private int c;
    private int r;
    private int g;
    private int b;
    private int lw;
    private int lh;
    private BufferedImage iimg;
    private int z=220;

    public BufferedImage doArufa(BufferedImage image,int max){
        iimg=image;
        for(int i=0;i<max;i++){
                lw=((image.getWidth()))/2;
                lh=((i+1)*(image.getHeight()))/max;
                if(lw==image.getWidth()){lw--;}
                if(lh==image.getHeight()){lh--;}
                System.out.println(lw+" "+lh);
                int tmp=(((i+1)*(image.getHeight()))/max);
                arufa01(0,tmp==image.getHeight()? tmp-1:tmp);
                System.out.println("good!");
        }
        for(int i=0;i<max;i++){
                lw=((image.getWidth()));
                lh=((i+1)*(image.getHeight()))/max;
                if(lw==image.getWidth()){lw--;}
                if(lh==image.getHeight()){lh--;}
                System.out.println(lw+" "+lh);
                int tmp=(((i+1)*(image.getHeight()))/max);
                arufa01(image.getWidth()-1,tmp==image.getHeight()? tmp-1:tmp);
                System.out.println("good!");
        }
        for(int i=0;i<image.getWidth();i++){
            for(int j=0;j<image.getHeight();j++){
                c = iimg.getRGB(i,j);
                a=c;
                b = c & 0x000000ff;
                c=c>>8;
                g = c & 0x0000ff;
                c=c>>8;
                r = c & 0x00ff;
                c=c>>8;
//                System.out.println(image.getHeight()+" "+i+" "+j+" "+c);
                if(c != 0x00 && r>=z && g>=z && b>=z){
//                    System.out.println("1 "+Integer.toHexString(a));
                    arufa01(i,j);
                    break;
                }else if(r<z && g<z && b<z && b!=0x00){
//                    System.out.println("2 "+Integer.toHexString(a));
                    break;
                }else{
//                    System.out.println("3 "+Integer.toHexString(a));
                }
            }
        }
        for(int i=0;i<image.getWidth();i++){
            for(int j=image.getHeight()-1;j>0;j--){
                c = iimg.getRGB(i,j);
                b = c & 0x000000ff;
                c=c>>8;
                g = c & 0x0000ff;
                c=c>>8;
                r = c & 0x00ff;
                c=c>>8;
                System.out.println(image.getHeight()+" "+i+" "+j+" "+c);
                if(c != 0x00 && r>=z && g>=z && b>=z){
                    arufa01(i,j);
                    break;
                }else if(r<z && g<z && b<z && b!=0x00){
                    break;
                }
            }
        }
        return image;
    }
    public BufferedImage test(BufferedImage i){
        iimg=i;
        lw=i.getWidth();
        lh=i.getHeight();
        arufa(0,0);
        return iimg;
    }

    private void arufa(int w,int h) {
        //rdlu
        boolean[][] check = new boolean[1000][1000];
        for (int i = 0; i < 1000; i++)
            for (int j = 0; j < 1000; j++) {
                check[i][j] = false;
            }
        Stack<Pair<Integer, Integer>> s = new Stack<>();
        s.push(new Pair<Integer, Integer>(w, h));
        while (!s.empty()) {
            int fw = s.peek().getKey();
            int fh = s.peek().getValue();
            s.pop();
            if (check[fw][fh]) continue;
            check[fw][fh] = true;
            c = iimg.getRGB(fw, fh);
//            System.out.printf( "%d,%d (%8x)\n", fw,fh,c );
            if (c != 0x00000000) {
                b = c & 0x000000ff;
//                c=c>>8;
                g = c & 0x0000ff00;
//                c=c>>8;
                r = c & 0x00ff0000;
//                c=c>>8;
                if (r >= z && g >= z && b >= z) {
                    iimg.setRGB(fw, fh, 0x0000ff00);
                    if (fw != lw - 1) {
                        s.push(new Pair<Integer, Integer>(fw + 1, fh));
                    }
                    if (fh != lh - 1) {
                        s.push(new Pair<Integer, Integer>(fw, fh + 1));
                    }
                    if (fw != 0) {
                        s.push(new Pair<Integer, Integer>(fw - 1, fh));
                    }
                    if (fh != 0) {
                        s.push(new Pair<Integer, Integer>(fw, fh - 1));
                    }
                }
            }
        }
    }

    private void arufa01(int w,int h){
        c = iimg.getRGB(w, h);
        if(c != 0x00000000 ){
            b = c & 0x000000ff;
            c=c>>8;
            g = c & 0x0000ff;
            c=c>>8;
            r = c & 0x00ff;
            c=c>>8;
            if(r>=z && g>=z && b>=z){
                iimg.setRGB(w,h,0x00000000);
                if(w!=lw){arufa01(w+1,h);}
                if(h!=lh){arufa01(w,h+1);}
                if(w!=0){arufa01(w-1,h);}
                if(h!=0){arufa01(w,h-1);}
            }
        }
    }

    private BufferedImage transparent(BufferedImage image){
        int w = image.getWidth();
        int h = image.getHeight();
        BufferedImage imageo=new BufferedImage(w,h,BufferedImage.TYPE_INT_ARGB);
        try{
            for(int i=0;i<w;i++){
                for(int j=0;j<h;j++){
                    int c = image.getRGB(i, j);
                    int  r = (c & 0x00ff0000) >> 16;
                    int  g = (c & 0x0000ff00) >> 8;
                    int  b = c & 0x000000ff;
                    if(r==255 && g==255 && b==255){
                        imageo.setRGB(i,j,0x00000000);
                    }else{
                        imageo.setRGB(i,j,image.getRGB(i,j));
                    }
                }
            }
        }catch(Exception e){
            System.out.println("image file write error. [sample.png]");
        }
        return imageo;
    }

    private BufferedImage trimming(BufferedImage image,int w,int h){
        int r=right(image,w,h);
        int l=left(image,w,h);
        int d=down(image,w,h);
        int u=up(image,w,h);
        int tmw = r-l;
        int tmh = d-u;
        BufferedImage imageo=new BufferedImage(tmw+1,tmh+1,BufferedImage.TYPE_INT_ARGB);
        for(int i=l;i<=r;i++){
            for(int j=u;j<=d;j++){
                imageo.setRGB(i-l,j-u,image.getRGB(i,j));
            }
        }
        return imageo;
    }

    private int up(BufferedImage image,int w,int h){
        int u[]=new int[w];
        for(int i=0;i<w;i++){
            u[i]=h;
            for(int j=0;j<h;j++){
                int c = image.getRGB(i, j);
                int r = (c & 0x00ff0000) >> 16;
                int g = (c & 0x0000ff00) >> 8;
                int b = c & 0x000000ff;
                if(!(r==255 && g==255 && b==255)){
                    u[i]=j;
                    break;
                }
                u[i]=h;
            }
        }
        return min(u,w);
    }

    private int down(BufferedImage image,int w,int h){
        int d[]=new int[w];
        for(int i=0;i<w;i++){
            for(int j=h-1;j>=0;j--){
                int c = image.getRGB(i, j);
                int r = (c & 0x00ff0000) >> 16;
                int g = (c & 0x0000ff00) >> 8;
                int b = c & 0x000000ff;
                if(!(r==255 && g==255 && b==255)){
                    d[i]=j;
                    break;
                }
            }
        }
        return max(d,w);
    }

    private int left(BufferedImage image,int w,int h){
        int l[]=new int[h];
        for(int i=0;i<h;i++){
            l[i]=w;
            for(int j=0;j<w;j++){
                int c = image.getRGB(j, i);
                int r = (c & 0x00ff0000) >> 16;
                int g = (c & 0x0000ff00) >> 8;
                int b = c & 0x000000ff;
                if(!(r==255 && g==255 && b==255)){
                    l[i]=j;
                    break;
                }
            }
        }
        return min(l,h);
    }

    private int right(BufferedImage image,int w,int h){
        int ri[]=new int[h];
        for(int i=0;i<h;i++){
            for(int j=w-1;j>=0;j--){
                int c = image.getRGB(j, i);
                int r = (c & 0x00ff0000) >> 16;
                int g = (c & 0x0000ff00) >> 8;
                int b = c & 0x000000ff;
                if(!(r==255 && g==255 && b==255)){
                    ri[i]=j;
                    break;
                }
            }
        }
        return max(ri,h);
    }

    private int max(int z[],int length){
        int max=z[0];
        for(int i=0;i<length;i++){
            if(z[i]>max){
                max=z[i];
            }
        }
        return max;
    }

    private int min(int z[],int length){
        int min=z[0];
        for(int i=0;i<length;i++){
            if(z[i]<min){
                min=z[i];
            }
        }
        return min;
    }
}
