//show where default theme files are
bundle show minima

posts - file name YEAR-MONTH-DAY-title.MARKUP

_site - defualt dest directory

categories, tags

{% highlight ruby %}
ruby code
{% endhighlight %}



# install
brew install gcc
brew install rbenv ruby-build
brew install libxml2
sudo gem update --system
xcode-select --install
sudo gem install nokogiri
bundle config build.nokogiri --use-system-libraries --with-xml2-include=$(brew --prefix libxml2)/include/libxml2
bundle install
sudo gem install pkg-config bundler
sudo gem install jekyll


# to run
bundler
jekyll serve

 http://127.0.0.1:4000/



 jekyll build