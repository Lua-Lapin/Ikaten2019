import com.spire.pdf.*;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class PdfToPng {

    private String currentDirectory;
    private PdfDocument pdf;

    PdfToPng(String filename){
        currentDirectory = filename;
        pdf = new PdfDocument();
    }

    public void conversion(String filename) {
        pdf.loadFromFile(currentDirectory + "\\pdf\\" + filename+".pdf");

        int index = 0;
        //Get the PDF pages
        PdfPageBase page = pdf.getPages().get(0);
        // Extract images from a particular page
        for (BufferedImage image : page.extractImages()) {
            try{
                //specify the file path and name
                File output = new File(currentDirectory+"\\pic\\" + String.format("%s_%d.png", filename, index++));
                //Save image as .png file
                ImageIO.write(image, "PNG", output);
            }catch (IOException e){
                System.out.println("404:Not found!!!");
            }
        }
    }

    public void changeCurrentDirectory(String fileName){
        currentDirectory = fileName;
    }
}
