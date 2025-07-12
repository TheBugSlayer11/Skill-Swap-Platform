import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from ..config import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

class CloudinaryService:
    @staticmethod
    async def upload_image(file: UploadFile, folder: str = "skill_swap_profiles"):
        """Upload an image to Cloudinary."""
        try:
            # Read the file content
            file_content = await file.read()
            
            # Reset file pointer for potential future reads
            await file.seek(0)
            
            result = cloudinary.uploader.upload(
                file_content,
                folder=folder,
                resource_type="auto",
                transformation=[
                    {"width": 400, "height": 400, "crop": "fill"},
                    {"quality": "auto"}
                ]
            )
            return {
                "url": result.get("secure_url"),
                "public_id": result.get("public_id")
            }
        except Exception as e:
            raise Exception(f"Failed to upload image: {str(e)}")

    @staticmethod
    async def delete_image(public_id: str):
        """Delete an image from Cloudinary."""
        try:
            result = cloudinary.uploader.destroy(public_id)
            return result
        except Exception as e:
            raise Exception(f"Failed to delete image: {str(e)}")

    @staticmethod
    async def update_profile_picture(file: UploadFile, user_id: str):
        """Upload or update a user's profile picture."""
        folder = f"skill_swap_profiles/{user_id}"
        return await CloudinaryService.upload_image(file, folder)
