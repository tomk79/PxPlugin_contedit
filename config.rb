# ************************************
# HTTP Path
# ************************************
http_path = "plugins/contedit/plugin.files"

# ************************************
# CSS Directory
# ************************************
css_dir = "plugins/contedit/plugin.files/resources/css/"

# ************************************
# Sass Directory
# ************************************
sass_dir = "src/sass/"

# ************************************
# Image Directory
# ************************************
images_dir = "plugins/contedit/plugin.files/resources/img/"

# ************************************
# JavaScript Directory
# ************************************
javascripts_dir = "plugins/contedit/plugin.files/resources/js/"

# ************************************
# Other
# ************************************
# .sass-cacheを出力するかどうか
cache = false

# クエストにクエリ文字列付けてキャッシュ防ぐ
asset_cache_buster :none

# Sassファイルをブラウザで確認
sass_options = { :debug_info => false }

# cssの主力形式 
output_style = :expanded

# trueで相対パス、falseで絶対パス
relative_assets = true

# CSSファイルにSassファイルの何行目に記述されたものかを出力する
line_comments = false
