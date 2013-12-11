<?php

/**
 * PX Plugin "contedit"
 */
class pxplugin_contedit_editor_main{

	private $px;
	private $plugin_obj;
	private $page_info;

	/**
	 * コンストラクタ
	 * @param $command = PXコマンド配列
	 * @param $px = PxFWコアオブジェクト
	 */
	public function __construct( $px, $plugin_obj, $page_info ){
		$this->px = $px;
		$this->plugin_obj = $plugin_obj;
		$this->page_info = $page_info;
	}

	/**
	 * 編集画面を出力
	 */
	public function execute(){
		switch( $this->px->req()->get_param('mode') ){
			case 'canvas': return $this->page_canvas(); break;
			case 'resources': return $this->page_resources(); break;
			case 'api': return $this->page_api(); break;
			default: break;
		}
		return $this->page_home();
	}//execute()

	/**
	 * ホーム画面
	 */
	private function page_home(){
		$obj_modules = $this->plugin_obj->factory_model_modules();
		header('Content-type: text/html');
		$src = '';
		ob_start(); ?>
<!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<title>contedit - Pickles Framework</title>
<script type="text/javascript" src="?PX=plugins.contedit.edit&amp;mode=resources&amp;path_resource=js/jquery-1.10.1.min.js"></script>
<script type="text/javascript" src="?PX=plugins.contedit.edit&amp;mode=resources&amp;path_resource=jquery_ui/js/jquery-ui-1.10.3.custom.min.js"></script>
<link rel="stylesheet" type="text/css" href="?PX=plugins.contedit.edit&amp;mode=resources&amp;path_resource=jquery_ui/css/ui-lightness/jquery-ui-1.10.3.custom.min.css" />
<script type="text/javascript" src="?PX=plugins.contedit.edit&amp;mode=resources&amp;path_resource=js/underscore-min.js"></script>
<script type="text/javascript" src="?PX=plugins.contedit.edit&amp;mode=resources&amp;path_resource=js/backbone-min.js"></script>
<script type="text/javascript" src="?PX=plugins.contedit.edit&amp;mode=resources&amp;path_resource=js/contConteditor.min.js"></script>
<script type="text/javascript">
(function(){
	function fitCanvas(){
		var win = $(document);
		$('.conteditUI-canvas')
			.height( win.height() )
		;
	}
	$(window).load( function(){
		$(window).on('resize', function(){
			fitCanvas();
			return true;
		});
		fitCanvas();
		$('.conteditUI-controlpanel').draggable();
	} );
	$(window).bind('unload', function(){
		if( !confirm('編集内容は保存されていません。画面を遷移してもよろしいですか？') ){
			return false;
		}
		return true;
	});
})();
</script>
<style type="text/css">
body{
	margin:0; padding:0;
}
.conteditUI{
	font-size:small;
}
.conteditUI,
.conteditUI *{
	color:#fff;
}
.conteditUI.conteditUI-controlpanel{
	display:block;
	position:fixed;
	top:40%; left:4%;
	background-color:#000; color:#fff;
	padding:10px;
	border-radius:10px;
	overflow:visible;
	box-shadow: 5px 5px 15px rgba(0,0,0,0.4);
}
.conteditUI.conteditUI-controlpanel a{
	display:inline-block;
	background-color:#eee;
	padding:0.3em 1em;
	border-radius:0.3em;
	color:#000;
}
.conteditUI.conteditUI-controlpanel .conteditUI-btn_ok{
	text-align:center;
	width:100px;
	font-weight:bold;
}
.conteditUI.conteditUI-controlpanel .conteditUI-btn_cancel{
	text-align:center;
	width:80px;
}
.conteditUI.conteditUI-title{
	font-weight:bold;
}
.conteditUI.conteditUI-canvas{
	width:auto;
	overflow:hidden;
}
.conteditUI .conteditUI-canvas_iframe{
	width:100%; height:100%;
	border:0 none;
	padding:0; margin:0;
}
</style>
</head>
<body>
<div class="conteditUI conteditUI-controlpanel">
	<div class="conteditUI-title">contedit: <?php print t::h( $this->page_info['title'] ); ?></div>
	<div>
		<a href="<?php print t::h($this->plugin_obj->href( ':' )); ?>" target="_top" class="conteditUI-btn_cancel" onclick="if( !confirm('編集内容は保存されていません。画面を遷移してもよろしいですか？') ){return false;}">キャンセル</a>
		<a href="<?php print t::h($this->plugin_obj->href( ':' )); ?>" target="_top" class="conteditUI-btn_ok" onclick="alert('開発中です。');return true;">保存</a>
	</div>
</div>
<div class="conteditUI conteditUI-canvas"><iframe src="<?php print t::h( $this->href('canvas') ); ?>" class="conteditUI-canvas_iframe" name="conteditUICanvas"></iframe></div>
</body>
</html>
<?php
		$src .= ob_get_clean();
		print $src;
		exit;
	}

	/**
	 * 編集画面
	 */
	private function page_canvas(){
		$theme_obj = $this->plugin_obj->factory_model_theme( $this->page_info );
		$obj_target_theme = $theme_obj->factory_theme( $this->page_info['layout'] );
		$obj_modules = $this->plugin_obj->factory_model_modules();

		header('Content-type: text/html');
		$src = '';
		ob_start(); ?>
<p>編集画面をロードしています。しばらくお待ち下さい。</p>
<script type="text/javascript">
// フレーム側のスクリプトをキックする
window.onload = function(){ window.parent.contConteditor.standby('canvas'); }
</script>
<?php
		$src .= ob_get_clean();

		$this->px->theme()->send_content($src, '');
		$src = $obj_target_theme->bind_contents( null );
			// 注意！
			//     → $obj_target_theme と、$obj_target_theme->px->theme() が、別のインスタンスのため、
			//        直接ソースを渡すことができない。
			//        この $obj_target_theme->px->theme() は、$this->px->theme() と同じインスタンス。

		print $src;
		exit;
	}

	/**
	 * リソース
	 */
	private function page_resources(){
		header('Content-type: text/html'); //デフォルト

		$path_resource = $this->px->req()->get_param('path_resource');
		$path_resource = preg_replace('/\.+/', '.', $path_resource);
		$realpath_resource = $this->px->get_conf('paths.px_dir').'plugins/contedit/data.files/resources/'.$path_resource;

		if( !is_file($realpath_resource) ){
			$this->px->page_notfound();
			exit;
		}

		$ext = strtolower( $this->px->dbh()->get_extension( $realpath_resource ) );
		switch( $ext ){
			case 'js':
				header('Content-type: text/javascript'); break;
			case 'css':
				header('Content-type: text/css'); break;
			case 'gif':
				header('Content-type: image/gif'); break;
			case 'jpg': case 'jpe': case 'jpeg':
				header('Content-type: image/jpeg'); break;
			case 'png':
				header('Content-type: image/png'); break;
		}
		$bin = file_get_contents($realpath_resource);
		print $bin;
		exit;
	}

	/**
	 * API
	 */
	private function page_api(){
		$rtn = array();
		switch( $this->px->req()->get_param('method') ){
			case 'get_module_definitions':
				$obj_modules = $this->plugin_obj->factory_model_modules();
				$rtn = $obj_modules->get_module_definitions();
				break;
			case 'get_module_keys':
				$obj_modules = $this->plugin_obj->factory_model_modules();
				$rtn = $obj_modules->get_module_keys();
				break;
			case 'get_module_list':
				$obj_modules = $this->plugin_obj->factory_model_modules();
				$rtn = $obj_modules->get_module_list();
				break;
			case 'get_content_data':
				// UTODO: 保存されたコンテンツデータ(ユーザーが編集したデータ)を返す。
				$rtn = array();
				break;
			default:
				$rtn = array(
					'error'=>'Unknown method.',
				);
				break;
		}

		header('Content-type: text/json');
		print json_encode( $rtn );
		exit;
	}

	// ----------------------------------------------------------------------------

	private function href( $mode ){
		$rtn = '';
		$rtn .= '?PX='.urlencode( $this->px->req()->get_param('PX') ).'&mode='.urlencode( $mode );
		return $rtn;
	}

}

?>
