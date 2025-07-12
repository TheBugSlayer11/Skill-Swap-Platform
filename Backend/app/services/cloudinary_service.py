import cloudinary
import cloudinary.uploader
from app.config import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret
)

class CloudinaryService:
    @staticmethod
    async def upload_image(file, folder: str = "skill_swap") -> dict:
        """
        Upload an image to Cloudinary
        
        Args:
            file: The file to upload
            folder: The folder to upload to in Cloudinary
            
        Returns:
            dict: Contains the uploaded image URL and public_id
        """
        try:
            result = cloudinary.uploader.upload(
                file,
                folder=folder,
                resource_type="auto"
            )
            
            return {
                "url": result.get("secure_url"),
                "public_id": result.get("public_id"),
                "format": result.get("format"),
                "width": result.get("width"),
                "height": result.get("height")
            }
        except Exception as e:
            raise Exception(f"Failed to upload image: {str(e)}")

    @staticmethod
    async def delete_image(public_id: str) -> bool:
        """
        Delete an image from Cloudinary
        
        Args:
            public_id: The public ID of the image to delete
            
        Returns:
            bool: True if deletion was successful
        """
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result.get("result") == "ok"
        except Exception as e:
            raise Exception(f"Failed to delete image: {str(e)}")

    @staticmethod
    async def update_image(public_id: str, file) -> dict:
        """
        Update an existing image in Cloudinary
        
        Args:
            public_id: The public ID of the image to update
            file: The new file to upload
            
        Returns:
            dict: Contains the updated image URL and public_id
        """
        try:
            # Delete the old image
            await CloudinaryService.delete_image(public_id)
            
            # Upload the new image
            return await CloudinaryService.upload_image(file)
        except Exception as e:
            raise Exception(f"Failed to update image: {str(e)}")

    @staticmethod
    def get_image_url(public_id: str, transformation: dict = None) -> str:
        """
        Get a transformed image URL
        
        Args:
            public_id: The public ID of the image
            transformation: Optional transformation parameters
            
        Returns:
            str: The transformed image URL
        """
        try:
            if transformation:
                return cloudinary.CloudinaryImage(public_id).build_url(**transformation)
            else:
                return cloudinary.CloudinaryImage(public_id).build_url()
        except Exception as e:
            raise Exception(f"Failed to generate image URL: {str(e)}") 