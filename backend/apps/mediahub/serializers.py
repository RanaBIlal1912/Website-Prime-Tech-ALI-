from rest_framework import serializers

from .models import DOC_EXT, IMAGE_EXT, VIDEO_EXT, MediaFile, MediaFolder

ALLOWED_EXT = IMAGE_EXT | VIDEO_EXT | DOC_EXT
MAX_UPLOAD_BYTES = 50 * 1024 * 1024  # 50 MB hard cap


class MediaFolderSerializer(serializers.ModelSerializer):
    file_count = serializers.IntegerField(source="files.count", read_only=True)

    class Meta:
        model = MediaFolder
        fields = ["id", "name", "parent", "file_count", "created_at"]
        read_only_fields = ["id", "created_at"]


class MediaFileSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = MediaFile
        fields = [
            "id", "file", "url", "title", "alt_text", "kind", "folder", "tags",
            "size", "mime_type", "width", "height", "usage_count", "created_at",
        ]
        read_only_fields = ["id", "url", "kind", "size", "mime_type", "width", "height",
                            "usage_count", "created_at"]

    def get_url(self, obj):
        request = self.context.get("request")
        if not obj.file:
            return None
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url

    def validate_file(self, value):
        ext = (value.name.rsplit(".", 1)[-1] if "." in value.name else "").lower()
        if ext not in ALLOWED_EXT:
            raise serializers.ValidationError(
                f"Unsupported file type '.{ext}'. Allowed: {', '.join(sorted(ALLOWED_EXT))}."
            )
        if value.size > MAX_UPLOAD_BYTES:
            raise serializers.ValidationError("File exceeds the 50 MB limit.")
        return value

    def create(self, validated_data):
        media = MediaFile(**validated_data)
        media.size = media.file.size
        media.kind = media.detect_kind()
        media.mime_type = getattr(media.file.file, "content_type", "")
        if media.kind == MediaFile.Kind.IMAGE and not media.file.name.lower().endswith(".svg"):
            self._read_image_dimensions(media)
        media.save()
        return media

    @staticmethod
    def _read_image_dimensions(media):
        try:
            from PIL import Image

            with Image.open(media.file) as img:
                media.width, media.height = img.size
            media.file.seek(0)
        except Exception:
            pass
