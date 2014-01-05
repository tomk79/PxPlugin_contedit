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
<link rel="stylesheet" type="text/css" href="?PX=plugins.contedit.edit&amp;mode=resources&amp;path_resource=css/contConteditor.css" />
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
</head>
<body>
<div class="conteditUI conteditUI-controlpanel">
	<div class="conteditUI-title">contedit: <?php print t::h( $this->page_info['title'] ); ?></div>

	<form class="conteditUI-add_element">
		<select><option name="">選択してください</option></select>
		<button>要素を増やす</button>
	</form>

	<div>
		<a href="<?php print t::h($this->plugin_obj->href( ':' )); ?>" class="conteditUI-btn_cancel">キャンセル</a>
		<a href="<?php print t::h($this->plugin_obj->href( ':' )); ?>" class="conteditUI-btn_save">保存</a>
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
		$realpath_resource = $this->px->get_conf('paths.px_dir').'plugins/contedit/plugin.files/resources/'.$path_resource;

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
				// ドキュメントモジュールの定義を得る
				$obj_modules = $this->plugin_obj->factory_model_modules();
				$rtn = $obj_modules->get_module_definitions();
				break;
			case 'get_document_contents':
				// 保存されたコンテンツデータ(ユーザーが編集したデータ)を返す。
				$obj_content = $this->plugin_obj->factory_model_content( $this->page_info );
				$rtn = array();
				$rtn['result'] = 1;
				$rtn['data'] = $obj_content->get();
				break;
			case 'save':
				// conteditUIが編集した結果を受け取って保存する
				$obj_content = $this->plugin_obj->factory_model_content( $this->page_info );
				if( !$obj_content->set( $this->px->req()->get_param('document_contents') ) ){
					$rtn = array();
					$rtn['result'] = 0;
					$rtn['error'] = 'データ形式にエラーがあります。';
					break;
				}
				if( !$obj_content->save() ){
					$rtn = array();
					$rtn['result'] = 0;
					$rtn['error'] = 'データの保存に失敗しました。';
					break;
				}
				$rtn = array();
				$rtn['result'] = 1;
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

	/**
	 * 
	 */
	private function href( $mode ){
		$rtn = '';
		$rtn .= '?PX='.urlencode( $this->px->req()->get_param('PX') ).'&mode='.urlencode( $mode );
		return $rtn;
	}

}

?>
